// The four endings the dial can land on, worst to best. Plain data, no React:
// the results scene, the share preview and the share text all read from here
// rather than each re-deriving the ending from the needle angle.
export const ENDINGS = ['trapped', 'sipping', 'partial', 'aligned'];

// Which quarter of the dial the needle landed in. It sweeps -75deg (fully
// aligned) to +75deg (non-aligned) in four equal bands.
export function endingFor(gaugeAngle) {
  if (gaugeAngle <= -37.5) return 'aligned';
  if (gaugeAngle <= 0) return 'partial';
  if (gaugeAngle <= 37.5) return 'sipping';
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
