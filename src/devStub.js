import { SCENARIOS } from './scenarios.js';

// Stand-in answers for dev builds only, so the results screen has a shape to
// look at without playing nineteen cards first.
//
// It stubs the *input* -- a set of answers -- rather than the outputs, so the
// radar, the scenario chips and the per-scenario detail all derive from it the
// same way they would from a real run. Nothing is invented: each entry is a
// real option off a real card, picked round-robin so the alignments vary.
export const DEV_STUB_ANSWERS = Object.fromEntries(
  SCENARIOS.map((scenario, i) => [scenario.code, scenario.options[i % scenario.options.length]])
);

// A comparison series to draw against, for when the live averages are empty --
// which they are on a fresh cutoff. Roughly mid-range on each quadrant.
export const DEV_STUB_AVERAGES = {
  power_positionality: { avg: 16, max: 35, runs: 0 },
  access_accountability: { avg: 11, max: 25, runs: 0 },
  collective_flourishing: { avg: 9, max: 20, runs: 0 },
  technology_nature: { avg: 7, max: 20, runs: 0 },
};
