// What the player has unlocked, remembered between visits.
//
// Only one thing so far: whether a Simulation run has been played through to
// the end. Study Mode is the debrief of that run -- its whole premise is that
// you have already answered the cards once -- so it stays locked on the setup
// screen until there is a run to debrief.
//
// localStorage rather than the sessionStorage the vision uses: the vision is
// free text tied to one sitting, while this is a door that should stay open
// when the player comes back tomorrow. Nothing here is personal -- it is a
// single boolean about this browser.
const SIMULATION_DONE_KEY = 'studyhall.simulationCompleted';

export function loadSimulationCompleted() {
  try {
    return localStorage.getItem(SIMULATION_DONE_KEY) === 'true';
  } catch {
    // Private browsing and blocked site data both throw here. The unlock is
    // simply not remembered; the run itself is unaffected.
    return false;
  }
}

export function saveSimulationCompleted() {
  try {
    localStorage.setItem(SIMULATION_DONE_KEY, 'true');
  } catch {
    /* see above -- storage being unavailable is not worth interrupting a run */
  }
}
