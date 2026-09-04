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
// On the -5..+5 scale zero is the middle ring, so a mid-range comparison line
// sits a little above it rather than a little above the centre.
export const DEV_STUB_AVERAGES = {
  power_positionality: { avg: 9, max: 35, min: -35, runs: 0 },
  access_accountability: { avg: 6, max: 25, min: -25, runs: 0 },
  collective_flourishing: { avg: 4, max: 20, min: -20, runs: 0 },
  technology_nature: { avg: 3, max: 20, min: -20, runs: 0 },
};
