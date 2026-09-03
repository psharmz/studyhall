// The closing vision the player writes on the last card.
//
// It lives in sessionStorage and nowhere else: it is free text, so it never
// goes to PostHog and never leaves the browser. Session-scoped on purpose --
// a Study Mode run started straight after the simulation, in the same tab,
// still sees what was written, while a new visit starts blank.
const VISION_KEY = 'studyhall.vision';

export function loadVision() {
  try {
    return sessionStorage.getItem(VISION_KEY) ?? '';
  } catch {
    // Private browsing and blocked site data both throw here. The vision
    // simply does not persist; nothing else about the run changes.
    return '';
  }
}

export function saveVision(text) {
  try {
    sessionStorage.setItem(VISION_KEY, text);
  } catch {
    /* see above -- storage being unavailable is not worth interrupting a run */
  }
}
