import { ALIGN_LABELS } from './scenarios.js';
import { ENDING_ALIGN, ENDING_CAPTIONS } from './endings.js';

export const GAME_NAME = 'STUDY HALL';
export const GAME_SUBTITLE = 'Environmental Justice in Tech';

// Wordle's trick is a picture made of characters: it travels intact through
// any text field, and it says how you did without giving the answers away.
// Two rows carry that here.
//
// The hamsters stand in for the ending's artwork -- wheel, drink, thought
// bubble, three hamsters playing -- so the text mirrors the picture in the
// preview.
const ENDING_EMOJI = {
  trapped: '🐹🎡',
  sipping: '🐹🥤',
  partial: '🐹💭',
  aligned: '🐹🐹🐹',
};

// How far round the dial they got, as a filled bar. Four blocks, one per band,
// lit up to whichever they landed in.
const DIAL_BAR = {
  trapped: '🟥⬛⬛⬛',
  sipping: '🟥🟧⬛⬛',
  partial: '🟥🟧🟨⬛',
  aligned: '🟥🟧🟨🟩',
};

export function shareLabelFor(ending) {
  return ALIGN_LABELS[ENDING_ALIGN[ending]];
}

// The link others follow. Strips any query or hash so a shared link never
// carries the sender's own session state into someone else's game.
export function shareUrl() {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}`;
}

// The exact text that gets copied, emailed or messaged. Kept short enough to
// survive an SMS without being cut in half.
export function buildShareText({ ending, score, max, url }) {
  return [
    `${GAME_NAME} · ${GAME_SUBTITLE}`,
    `${ENDING_EMOJI[ending]} ${shareLabelFor(ending)} — ${score}/${max}`,
    DIAL_BAR[ending],
    ENDING_CAPTIONS[ending],
    `Play: ${url}`,
  ].join('\n');
}

export function buildEmailSubject(ending) {
  return `${GAME_NAME} — I got ${shareLabelFor(ending).toLowerCase()}`;
}

export { ENDING_EMOJI, DIAL_BAR };
