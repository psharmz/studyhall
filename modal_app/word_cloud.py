"""Serves the results word cloud.

The game is a static bundle with nowhere to hide a secret, so it never talks to
PostHog directly: reading data back needs a *personal* API key, which is a real
secret. This app holds that key and exposes one public, read-only endpoint.

Two functions, deliberately split:

  refresh()     runs on a schedule, queries PostHog, writes the result to a
                modal.Dict. This is the only thing that touches PostHog.
  word_cloud()  the public endpoint. Reads the cached document and returns it.
                No PostHog call on the request path, so a page load never waits
                on a warehouse query and traffic spikes cost nothing extra.

Deploy:
    modal deploy modal_app/word_cloud.py

One-off refresh (also useful for the very first fill):
    modal run modal_app/word_cloud.py

Requires a Modal secret named "posthog" holding one value:
    POSTHOG_PERSONAL_API_KEY   personal key (phx_...) with the query:read scope

The project id and API host are not secret -- they are constants below, and an
environment variable of the same name still overrides either if that changes.
Keeping them out of the secret means `modal secret create --force`, which
replaces a secret wholesale, cannot silently drop them.
"""

import os
from datetime import datetime, timezone

import modal

app = modal.App("studyhall-word-cloud")

image = (
    modal.Image.debian_slim()
    .pip_install("requests", "fastapi[standard]")
    # The quadrant map is shared with the game, which imports the same file to
    # build its radar axes. Copied in rather than duplicated here so the two
    # cannot disagree about which scenarios feed which quadrant.
    .add_local_file("quadrants.json", "/root/quadrants.json", copy=True)
)

# The last good document. Survives redeploys, so the endpoint keeps serving the
# previous counts even if a refresh fails.
cache = modal.Dict.from_name("studyhall-word-cloud", create_if_missing=True)

posthog = modal.Secret.from_name("posthog")

CACHE_KEY = "document"

# Not secrets: the project id sits next to a token PostHog itself labels "safe
# to use in public apps", and the host is just the region.
PROJECT_ID = os.environ.get("POSTHOG_PROJECT_ID") or "563178"
API_HOST = os.environ.get("POSTHOG_API_HOST") or "https://us.posthog.com"

# Enough to fill a cloud without turning it into soup.
MAX_WORDS_ALL = 60
MAX_WORDS_PER_COUNTRY = 25
# A country needs this many distinct words before it earns its own option in
# the picker. Its picks still count towards "All" either way.
MIN_WORDS_PER_COUNTRY = 5

# A fully aligned answer is worth +5 and a non-aligned one -5, so a quadrant
# runs from -5 to +5 per card.
POINTS_PER_CARD = 5
NON_ALIGNED_POINTS = -POINTS_PER_CARD

# Clean slate. Only events at or after this instant count towards the published
# aggregates -- everything before it was build-and-test traffic, including runs
# scored on the old -2/+1/+3 scale. Nothing is deleted from PostHog; those rows
# are simply not counted here. Move it (or set POSTHOG_DATA_SINCE) to re-cut the
# window, e.g. again on launch day.
DATA_SINCE = os.environ.get("POSTHOG_DATA_SINCE") or "2026-08-28 06:01:00"

# Every query is scoped by it, so the cloud, the country split and the quadrant
# averages all describe the same population.
SINCE = f"timestamp >= toDateTime('{DATA_SINCE}')"

# All-time counts, as agreed -- no date filter.
#
# Counted off `goal_words_submitted`, one row per player, whose `goal_words`
# property is a JSON array of the chips they picked. arrayJoin unpacks it into
# one row per word. assumeNotNull is needed because JSONExtractArrayRaw on a
# nullable property yields Nullable(Array(String)), which ClickHouse rejects;
# replaceAll strips the JSON quotes off each element.
WORDS = (
    "replaceAll(arrayJoin(JSONExtractArrayRaw("
    "assumeNotNull(toString(properties.goal_words)))), '\"', '')"
)

ALL_QUERY = f"""
  SELECT {WORDS} AS word, count() AS c
  FROM events
  WHERE event = 'goal_words_submitted' AND {SINCE}
  GROUP BY word
  HAVING notEmpty(word)
  ORDER BY c DESC
  LIMIT {MAX_WORDS_ALL}
"""

# Country comes from PostHog's GeoIP enrichment, which resolves the request IP
# server-side at ingestion. The browser never does a geolocation lookup and this
# project stores no IP -- see the note in src/telemetry.js.
COUNTRY_QUERY = f"""
  SELECT properties['$geoip_country_name'] AS country,
         {WORDS} AS word,
         count() AS c
  FROM events
  WHERE event = 'goal_words_submitted' AND {SINCE}
    AND notEmpty(toString(properties['$geoip_country_name']))
  GROUP BY country, word
  HAVING notEmpty(word)
  ORDER BY country ASC, c DESC
"""


def _hogql(query: str):
    import requests

    key = os.environ["POSTHOG_PERSONAL_API_KEY"]

    res = requests.post(
        f"{API_HOST}/api/projects/{PROJECT_ID}/query/",
        headers={"Authorization": f"Bearer {key}"},
        json={"query": {"kind": "HogQLQuery", "query": query}},
        timeout=60,
    )

    # Raised as a plain RuntimeError rather than requests' own HTTPError: Modal
    # sends exceptions back to the caller, and it can only rebuild types the
    # local environment also has. `requests` is not installed locally, so an
    # HTTPError arrives as an unreadable deserialization failure instead of the
    # actual problem. The status and body are what matter anyway.
    if not res.ok:
        hint = ""
        if res.status_code in (401, 403):
            hint = (
                " -- check POSTHOG_PERSONAL_API_KEY is a personal key with "
                "query:read scope, and that POSTHOG_PROJECT_ID is your real "
                "project id"
            )
        raise RuntimeError(
            f"PostHog query failed: {res.status_code} {res.text[:400]}{hint}"
        )

    return res.json().get("results", [])


# Per-run points for every answered scenario.
#
# Scored from `option_alignment`, NOT the recorded `points_applied`. The scoring
# scale has changed twice (non/partial/full was -2/+1/+3, then 0/+2/+5, now
# -5/+2/+5) and every generation of rows is still in the warehouse, so
# points_applied is not comparable across those changes. Alignment has always
# meant the same thing, so re-scoring from it puts every run on today's scale.
# A timeout has no alignment and counts as 0 -- not as a non-aligned answer --
# which is the one case where this and the player's own total differ.
#
# Averaging happens in Python because a quadrant's average has to account for
# partial decks -- see _quadrant_averages.
POINTS_QUERY = f"""
  SELECT properties.run_id AS run,
         properties.scenario_code AS code,
         avg(multiIf(
           toString(properties.option_alignment) = 'full', {POINTS_PER_CARD},
           toString(properties.option_alignment) = 'partial', 2,
           toString(properties.option_alignment) = 'non', {NON_ALIGNED_POINTS},
           0
         )) AS pts
  FROM events
  WHERE event = 'question_answered' AND {SINCE}
    AND notEmpty(toString(properties.run_id))
    AND notEmpty(toString(properties.scenario_code))
  GROUP BY run, code
"""


def _load_quadrants():
    import json

    with open("/root/quadrants.json") as f:
        return json.load(f)["quadrants"]


def _quadrant_averages(point_rows):
    """Average score per quadrant, on the same scale as a player's own total.

    Runs are not comparable head-on: a 10-card game never sees scenarios 15-19,
    so its raw total for a quadrant those belong to is low for a reason that has
    nothing to do with how the player did. Averaging the *per-card* score and
    scaling it back up by the quadrant's size keeps short and full decks on the
    same footing.
    """
    quadrants = _load_quadrants()
    codes_for = {
        q["slug"]: {f"S.{n:02d}" for n in q["scenarios"]} for q in quadrants
    }
    size_for = {q["slug"]: len(q["scenarios"]) for q in quadrants}

    # run -> slug -> [points on each answered card in that quadrant]
    per_run: dict[str, dict[str, list]] = {}
    for run, code, pts in point_rows:
        if pts is None:
            continue
        for slug, codes in codes_for.items():
            if code in codes:
                per_run.setdefault(run, {}).setdefault(slug, []).append(float(pts))

    averages = {}
    for slug, size in size_for.items():
        # One number per run: what that run averaged per card in this quadrant.
        per_card = [
            sum(points) / len(points)
            for run in per_run.values()
            if (points := run.get(slug))
        ]
        if not per_card:
            continue
        averages[slug] = {
            "avg": round(sum(per_card) / len(per_card) * size, 1),
            "max": size * POINTS_PER_CARD,
            "min": size * NON_ALIGNED_POINTS,
            "runs": len(per_card),
        }
    return averages


def _build_document(all_rows, country_rows):
    all_words = [{"text": w, "count": int(c)} for w, c in all_rows]

    grouped: dict[str, list] = {}
    for country, word, count in country_rows:
        grouped.setdefault(country, []).append({"text": word, "count": int(count)})

    by_country = {
        country: words[:MAX_WORDS_PER_COUNTRY]
        for country, words in sorted(grouped.items())
        if len(words) >= MIN_WORDS_PER_COUNTRY
    }

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "all": all_words,
        "by_country": by_country,
    }


@app.function(image=image, secrets=[posthog], schedule=modal.Cron("0 6 * * *"))
def refresh():
    """Query PostHog and cache the result. The only function with the key."""
    doc = _build_document(_hogql(ALL_QUERY), _hogql(COUNTRY_QUERY))
    doc["quadrant_averages"] = _quadrant_averages(_hogql(POINTS_QUERY))

    # An empty result is cached rather than rejected. It used to raise, back
    # when the results screen fell back to sample words and a blank cloud looked
    # broken -- but the screen says "Not enough data" now, and after a cutoff
    # reset empty is the correct answer. A query that genuinely fails still
    # raises from _hogql, so a stale cache is never mistaken for real zero.
    if not doc["all"]:
        print(f"No goal_words_submitted events since {DATA_SINCE} -- caching an empty cloud.")

    if not doc["by_country"]:
        print(
            "WARNING: no country breakdown -- every row was missing "
            "$geoip_country_name. Check that the GeoIP transformation is "
            "enabled on the PostHog project."
        )

    cache[CACHE_KEY] = doc
    print(
        f"Cached {len(doc['all'])} words across "
        f"{len(doc['by_country'])} countries."
    )
    for slug, a in doc["quadrant_averages"].items():
        print(f"  avg {slug:<24} {a['avg']:>5} / {a['max']}  ({a['runs']} runs)")
    return doc


# Public aggregate data, no credentials, so any origin may read it. The cache
# header keeps repeat views off Modal entirely.
HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=300",
}


@app.function(image=image)
@modal.fastapi_endpoint(method="GET")
def word_cloud():
    """What the game fetches. Never calls PostHog -- reads the cache only."""
    from fastapi.responses import JSONResponse

    doc = cache.get(CACHE_KEY)
    if doc is None:
        # Nothing cached yet. 503 rather than an empty document, so the game
        # falls back to its sample data instead of drawing an empty cloud.
        return JSONResponse(
            {"error": "not yet populated -- run the refresh function"},
            status_code=503,
            headers=HEADERS,
        )
    return JSONResponse(doc, headers=HEADERS)


@app.function(image=image, secrets=[posthog])
def check():
    """Diagnose credentials without printing them.

    Run with:  modal run modal_app/word_cloud.py::check

    Checks the key on its own first (/api/users/@me), which does not involve the
    project id at all -- so a failure here means the key, and a failure only on
    the project call means the id or its scope.
    """
    import requests

    key = os.environ.get("POSTHOG_PERSONAL_API_KEY", "")

    # Shape only. The prefix is a public type marker (phx_ personal, phc_
    # project), never the key itself.
    print(f"api host:   {API_HOST}")
    print(f"project id: {PROJECT_ID}")
    print(f"key prefix: {key[:4]!r}  length: {len(key)}")
    if key != key.strip():
        print("  !! key has leading/trailing whitespace -- re-create the secret")
    if key.startswith("phc_"):
        print("  !! that is a PROJECT key. The query API needs a PERSONAL key (phx_),")
        print("     created under PostHog Settings -> Personal API keys.")

    who = requests.get(
        f"{API_HOST}/api/users/@me/",
        headers={"Authorization": f"Bearer {key}"},
        timeout=30,
    )
    print(f"\nkey valid?  {who.status_code}", end=" ")
    if not who.ok:
        print("FAILED")
        print(f"  {who.text[:300]}")
        print("  -> the key is rejected on its own; the project id is not the problem.")
        print("  -> if your PostHog is in the EU, set POSTHOG_API_HOST=https://eu.posthog.com")
        return
    print(f"ok -- {who.json().get('email', '(unknown)')}")

    # The real test: can this key run a query against this project? A scoped key
    # cannot read the org-wide project list, so asking that proves nothing.
    probe = requests.post(
        f"{API_HOST}/api/projects/{PROJECT_ID}/query/",
        headers={"Authorization": f"Bearer {key}"},
        json={"query": {"kind": "HogQLQuery", "query": "SELECT 1"}},
        timeout=30,
    )
    print(f"query on project {PROJECT_ID}? {probe.status_code}", end=" ")
    if probe.ok:
        print("ok -- credentials are good")
    else:
        print("FAILED")
        print(f"  {probe.text[:300]}")
        print("  -> key works but cannot query this project: check it is scoped to")
        print("     project " + PROJECT_ID + " and has the query:read scope.")
        return

    # How much there is to aggregate.
    counted = requests.post(
        f"{API_HOST}/api/projects/{PROJECT_ID}/query/",
        headers={"Authorization": f"Bearer {key}"},
        json={"query": {"kind": "HogQLQuery", "query":
              f"SELECT count() FROM events WHERE event = 'goal_words_submitted' AND {SINCE}"}},
        timeout=30,
    )
    if counted.ok:
        n = counted.json()["results"][0][0]
        print(f"\ngoal_words_submitted events since {DATA_SINCE}: {n}")
        if n == 0:
            print("  none yet -- play a Simulation run on the prod bundle and pick")
            print("  some words on the goals screen, then run refresh again.")


@app.local_entrypoint()
def main():
    """`modal run` this file to refresh on demand rather than waiting for the cron."""
    doc = refresh.remote()
    print(f"generated_at: {doc['generated_at']}")
    print("countries:", ", ".join(doc["by_country"]) or "(none)")
