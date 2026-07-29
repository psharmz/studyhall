// Synthesized North American telephone ringback tone (440 Hz + 480 Hz),
// played via the Web Audio API so the phone buttons don't need any external
// audio file or network request. Returns the total duration in ms so the
// caller can reveal the advisor bubble once the two rings finish.
let ringCtx = null;

export const RING_ON = 0.4;
export const RING_OFF = 0.2;
export const RINGS = 2;
export const RING_TOTAL_MS = RINGS * (RING_ON + RING_OFF) * 1000;

export function playRingTone() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return RING_TOTAL_MS;
  if (!ringCtx) ringCtx = new AudioCtx();
  if (ringCtx.state === 'suspended') ringCtx.resume();

  const now = ringCtx.currentTime;

  for (let i = 0; i < RINGS; i++) {
    const start = now + i * (RING_ON + RING_OFF);
    [440, 480].forEach((freq) => {
      const osc = ringCtx.createOscillator();
      const gain = ringCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.15, start + 0.02);
      gain.gain.setValueAtTime(0.15, start + RING_ON - 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + RING_ON);
      osc.connect(gain).connect(ringCtx.destination);
      osc.start(start);
      osc.stop(start + RING_ON + 0.02);
    });
  }
  return RING_TOTAL_MS;
}
