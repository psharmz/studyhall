// Which quarter of the dial the needle landed in. It sweeps -75deg (fully
// aligned) to +75deg (non-aligned) in four equal bands, and on the -100..+100
// scale those quarters fall on the scoring card's round numbers: green +50 to
// +100, yellow +1 to +49, orange 0 to -49, red -50 to -100.
//
// Each band takes its own edge and gives up the other: zero sits at 0deg and
// reads orange, and -50 sits at +37.5deg and reads red, which is why the middle
// two comparisons are strict where the first is not.
export function endingFor(gaugeAngle) {
  if (gaugeAngle <= -37.5) return 'aligned';
  if (gaugeAngle < 0) return 'partial';
  if (gaugeAngle < 37.5) return 'sipping';
  return 'trapped';
}

export const ENDING_CAPTIONS = {
  aligned: 'Your freedom is a direct result of just and inclusive relationships with others',
  partial: "Good job, you're starting to come out of it. Keep going",
  sipping: 'Looks like you are drinking the cool aide',
  trapped: 'You are trapped in the capitalism rat race',
};

// The dial has four bands but only three categories -- the middle two are both
// partially aligned -- so a chip follows the category, not the band.
export const ENDING_ALIGN = {
  aligned: 'full',
  partial: 'partial',
  sipping: 'partial',
  trapped: 'non',
};
