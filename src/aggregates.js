// Where the results screen's cross-player figures come from.
//
// The counts live in PostHog: every word a player picks on the goals screen
// emits a `goal_word_selected` row (see telemetry.js). Reading them back is
// the awkward half -- PostHog's query API needs a *personal* API key with read
// scope, which is a real secret and cannot ship inside a static bundle. So the
// app never talks to PostHog directly. It fetches a pre-aggregated document
// from VITE_WORD_CLOUD_URL, served by the Modal app in modal_app/word_cloud.py,
// which is what holds the key.
//
// Expected shape:
//
//   {
//     "generated_at": "2026-08-27T10:00:00Z",
//     "all":        [{ "text": "extraction", "count": 42 }, ...],
//     "by_country": { "Brazil": [{ "text": "water", "count": 12 }, ...], ... },
//     "quadrant_averages": {
//       "power_positionality": { "avg": 14.0, "max": 35, "runs": 25 }, ...
//     }
//   }
//
// One document, one fetch: the word cloud and the radar's average series are
// both cross-player aggregates off the same refresh, so splitting them into two
// endpoints would mean two URLs to configure and two round trips.
//
// Counts, not font sizes -- the scaling is this module's job, so the source
// stays a plain tally.
const WORD_CLOUD_URL = import.meta.env.VITE_WORD_CLOUD_URL;

// The font-size range the cloud draws between. The largest word in whatever
// slice is on show gets MAX, the smallest gets MIN, so a slice with 8 plays
// reads as legibly as one with 8,000.
const SIZE_MIN = 12;
const SIZE_MAX = 44;

function scaleToSizes(entries) {
  if (!entries.length) return [];
  const counts = entries.map((e) => e.count);
  const lo = Math.min(...counts);
  const hi = Math.max(...counts);
  return entries.map((e) => ({
    text: e.text,
    // A flat tally (every word tied) would divide by zero; give it the midpoint.
    size: hi === lo ? (SIZE_MIN + SIZE_MAX) / 2
      : SIZE_MIN + ((e.count - lo) / (hi - lo)) * (SIZE_MAX - SIZE_MIN),
    count: e.count,
  }));
}

function normaliseList(list) {
  if (!Array.isArray(list)) return [];
  const clean = list
    .filter((e) => e && typeof e.text === 'string' && Number.isFinite(e.count) && e.count > 0)
    .sort((a, b) => b.count - a.count);
  return scaleToSizes(clean);
}

// The raw document, fetched at most once per page load however many parts of
// the results screen ask for it. Never throws: these are read-only extras on a
// results screen, and a fetch that fails should leave the rest of the page
// alone.
let documentPromise = null;

// Deliberately not tied to any caller's AbortSignal. The promise is shared, so
// binding it to the first consumer meant React's StrictMode double-mount
// aborted the request for everyone -- the cached promise then resolved null and
// every later reader got that null for the rest of the page load. Consumers
// check their own signal before using the result instead; the document is a few
// kB and already cached for five minutes by the endpoint.
function loadDocument() {
  if (!WORD_CLOUD_URL) return Promise.resolve(null);
  documentPromise ??= fetch(WORD_CLOUD_URL)
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
  return documentPromise;
}

// Returns { all, byCountry, generatedAt } or null if there is nothing to show.
export async function fetchWordCloud() {
  const data = await loadDocument();
  if (!data) return null;

  const all = normaliseList(data.all);
  if (!all.length) return null;

  const byCountry = {};
  for (const [country, list] of Object.entries(data.by_country ?? {})) {
    const words = normaliseList(list);
    // A country with a couple of plays is noise, not a slice worth offering.
    if (words.length >= MIN_WORDS_PER_COUNTRY) byCountry[country] = words;
  }
  return { all, byCountry, generatedAt: data.generated_at ?? null };
}

// Average score per quadrant across everyone who has played, keyed by slug:
// { power_positionality: { avg, max, runs }, ... }. Null when unavailable, in
// which case the radar simply does not draw the comparison series rather than
// inventing one.
export async function fetchQuadrantAverages() {
  const data = await loadDocument();
  const averages = data?.quadrant_averages;
  if (!averages || !Object.keys(averages).length) return null;
  return averages;
}

// Below this a country's cloud is too sparse to be worth its own option in
// the picker; those words still count towards "All".
const MIN_WORDS_PER_COUNTRY = 5;

