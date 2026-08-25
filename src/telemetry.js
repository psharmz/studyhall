import posthog, { POSTHOG_ENABLED } from './posthog.js';

// Every event carries this. Bump it whenever a property is renamed, retyped or
// dropped, so a warehouse query can tell old rows from new ones.
export const TELEMETRY_SCHEMA_VERSION = 1;

// Naming rules, kept deliberately narrow so the export lands in a warehouse
// without a cleanup pass:
//   * events are <noun>_<past tense verb>, snake_case
//   * properties are snake_case, flat -- no nested objects, no arrays of objects
//   * durations end in _ms, counts end in _count, booleans start with is_/has_
//     or end in _enabled
//   * a property means the same thing on every event that carries it
//
// Country is NOT collected here. PostHog resolves it server-side at ingestion
// into $geoip_country_code / $geoip_country_name, so there is no client-side IP
// lookup and no third-party geolocation request.

function capture(event, properties) {
  if (!POSTHOG_ENABLED) return;
  try {
    posthog.capture(event, properties);
  } catch {
    /* telemetry must never take the game down with it */
  }
}

function newRunId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

// Which playthrough this is within the current page load: 1 for the first game,
// 2 for the Study Mode run started off its results screen, and so on. It resets
// on reload -- run_id is the durable key, this is only the order within a visit.
let runOrdinal = 0;

// --- run lifecycle ---------------------------------------------------------

// Registers the run context as super-properties, so every event that follows
// -- including the ones fired from deep inside a component -- can be joined
// back to a single playthrough on run_id alone, with no session stitching.
export function startRun({ language, mode, cards, sound }, { isStudyFollowUp = false, simulationAnswerCount = 0 } = {}) {
  runOrdinal += 1;
  const runId = newRunId();

  if (POSTHOG_ENABLED) {
    try {
      posthog.register({
        run_id: runId,
        run_mode: mode,
        run_language: language,
        run_card_count: cards,
        run_sound_enabled: Boolean(sound),
        run_ordinal: runOrdinal,
        telemetry_schema_version: TELEMETRY_SCHEMA_VERSION,
      });
    } catch {
      /* ignore -- the capture below still goes out with whatever is registered */
    }
  }

  capture('run_started', {
    // Repeated from the super-properties on purpose: run_started is the row a
    // settings breakdown reads, and it should not need a self-join to get them.
    run_mode: mode,
    run_language: language,
    run_card_count: cards,
    run_sound_enabled: Boolean(sound),
    is_study_follow_up: isStudyFollowUp,
    simulation_answer_count: simulationAnswerCount,
  });

  return runId;
}

export function captureRunCompleted({
  deckSize,
  questionsAnsweredCount,
  timeoutCount,
  advisorCallCount,
  totalScore,
  scoreMin,
  scoreMax,
  durationMs,
}) {
  const span = scoreMax - scoreMin;
  capture('run_completed', {
    deck_size: deckSize,
    questions_answered_count: questionsAnsweredCount,
    timeout_count: timeoutCount,
    advisor_call_count: advisorCallCount,
    total_score: totalScore,
    score_min: scoreMin,
    score_max: scoreMax,
    // 0 = fully non-aligned, 1 = fully aligned. Comparable across deck sizes.
    score_normalized: span === 0 ? null : round3((totalScore - scoreMin) / span),
    run_duration_ms: durationMs,
  });
}

// The floating Restart button: the run ends without a score. Kept separate from
// run_completed so an abandoned run never lands in the scoring tables.
export function captureRunAbandoned({ fromScreen, questionsAnsweredCount, durationMs }) {
  capture('run_abandoned', {
    from_screen: fromScreen,
    questions_answered_count: questionsAnsweredCount,
    run_duration_ms: durationMs,
    is_debug_jump: true,
  });
}

// The "Go to Results Screen" band picker parks the needle at a synthetic score.
// No score is reported here, and no run_completed follows, so fabricated totals
// never enter the analytics at all.
export function captureResultsJumped({ bandName, bandFraction, fromScreen }) {
  capture('results_jumped', {
    band_name: bandName,
    band_fraction: bandFraction,
    from_screen: fromScreen,
    is_debug_jump: true,
  });
}

// --- screens ---------------------------------------------------------------

// One row per screen visit, emitted on the way out. Group by screen_name for
// dwell time; screen_name is the app's own phase id, so it stays stable.
export function captureScreenExited({ screenName, nextScreen, durationMs, scenarioCode, questionNumber }) {
  capture('screen_exited', {
    screen_name: screenName,
    next_screen: nextScreen,
    duration_ms: durationMs,
    scenario_code: scenarioCode ?? null,
    question_number: questionNumber ?? null,
  });
}

// --- goals screen ----------------------------------------------------------

// The words are picked from a fixed vocabulary (no free text), so this carries
// no personal data. goal_words is the one array in the schema -- flat strings,
// which every warehouse handles.
export function captureGoalWordsSubmitted({ words }) {
  capture('goal_words_submitted', {
    goal_words: words,
    goal_word_count: words.length,
  });
}

// --- questions -------------------------------------------------------------

// One row per question, answered or not. A timeout sets is_timeout and leaves
// the option_* fields null; points_applied is the canonical scoring column
// either way, so no query needs to union two event types.
export function captureQuestionAnswered({
  scenarioCode,
  questionNumber,
  optionLetter,
  optionIndex,
  optionAlignment,
  optionScore,
  isTimeout,
  pointsApplied,
  timeToAnswerMs,
  totalScoreAfter,
  advisorCallCount,
  advisorRoles,
}) {
  capture('question_answered', {
    scenario_code: scenarioCode,
    question_number: questionNumber,
    option_letter: optionLetter ?? null,
    option_index: optionIndex ?? null,
    option_alignment: optionAlignment ?? null,
    option_score: optionScore ?? null,
    is_timeout: isTimeout,
    points_applied: pointsApplied,
    time_to_answer_ms: timeToAnswerMs,
    total_score_after: totalScoreAfter,
    // What was spent on THIS question, so advisor use can be read off the
    // answer row without joining back to advisor_called.
    advisor_call_count: advisorCallCount,
    advisor_roles: advisorRoles,
  });
}

// --- advisors --------------------------------------------------------------

// Fired when the phone is picked up, not when the bubble is dismissed: a call
// that was rung and then abandoned still counts as a call that was made.
export function captureAdvisorCalled({
  scenarioCode,
  questionNumber,
  advisorIndex,
  advisorRole,
  advisorTone,
  isUnlimited,
  callsAvailable,
}) {
  capture('advisor_called', {
    scenario_code: scenarioCode,
    question_number: questionNumber,
    advisor_index: advisorIndex,
    advisor_role: advisorRole ?? null,
    advisor_tone: advisorTone ?? null,
    is_unlimited: isUnlimited,
    // Unused calls at the moment the phone was picked up, this one included.
    // Null in study mode, where the budget does not apply.
    calls_available: callsAvailable,
  });
}

// --- results ---------------------------------------------------------------

// Per-theme totals off the spider chart, flattened to one column per category
// (category_<slug>_score) rather than nested JSON.
//
// is_placeholder_scores is true while ResultsCharts still renders its hardcoded
// RADAR_AXES values. When the chart is wired to real answers, pass the computed
// totals and set it false -- the event shape does not change.
export function captureCategoryScores({
  categories,
  maxPerCategory,
  totalScore,
  scoreMin,
  scoreMax,
  isPlaceholder,
}) {
  const properties = {
    category_score_max: maxPerCategory,
    total_score: totalScore,
    score_min: scoreMin,
    score_max: scoreMax,
    is_placeholder_scores: isPlaceholder,
  };
  for (const category of categories) {
    properties[`category_${category.slug}_score`] = category.score;
  }
  capture('category_scores_reported', properties);
}

export function captureScoreBreakdownViewed() {
  capture('score_breakdown_viewed', {});
}

export function captureResultsShared({ method }) {
  capture('results_shared', { share_method: method });
}

// --- study mode feedback ---------------------------------------------------

export function captureClarityRated({ scenarioCode, questionNumber, rating }) {
  capture('clarity_rated', {
    scenario_code: scenarioCode,
    question_number: questionNumber,
    clarity_rating: rating,
  });
}

export function captureLearnBeyondOpened({ scenarioCode, questionNumber }) {
  capture('learn_beyond_opened', {
    scenario_code: scenarioCode,
    question_number: questionNumber,
  });
}

// Written in the box under the clarity faces. The rating is sent with it so
// the note can be read against the face that prompted it. The text itself is
// what the player typed, so it goes no further than this event.
export function captureScenarioFeedbackSubmitted({
  scenarioCode,
  questionNumber,
  rating,
  text,
}) {
  capture('scenario_feedback_submitted', {
    scenario_code: scenarioCode,
    question_number: questionNumber,
    clarity_rating: rating,
    feedback_text: text,
    feedback_char_count: text.length,
  });
}

export function captureFeedbackFormOpened({ scenarioCode, questionNumber }) {
  capture('feedback_form_opened', {
    scenario_code: scenarioCode,
    question_number: questionNumber,
  });
}

function round3(n) {
  return Math.round(n * 1000) / 1000;
}
