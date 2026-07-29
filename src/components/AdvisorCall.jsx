import { useEffect, useRef, useState } from 'react';
import { playRingTone, RING_TOTAL_MS } from '../ringtone.js';
import { useTypewriter } from '../useTypewriter.js';

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
    </svg>
  );
}

// Three advisor calls per game, spendable on any card. Tapping an unused
// phone rings it (only that icon animates); after the two rings the bubble
// opens and types the advisor response. Dismissing the bubble consumes the
// call: that icon gets a persistent slash for the rest of the game.
export function AdvisorCall({ text, sound = true, usedCalls, onUseCall }) {
  const [phase, setPhase] = useState('idle'); // idle | ringing | talking
  const [active, setActive] = useState(null);
  const timerRef = useRef(null);
  const { visible, done } = useTypewriter(text, { active: phase === 'talking', speed: 18 });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function ring(i) {
    if (phase !== 'idle' || usedCalls[i]) return;
    setActive(i);
    setPhase('ringing');
    // Sound off still rings visually -- same timing, no audio
    const ms = sound ? playRingTone() : RING_TOTAL_MS;
    timerRef.current = setTimeout(() => setPhase('talking'), ms + 150);
  }

  function dismiss() {
    onUseCall(active);
    setPhase('idle');
    setActive(null);
  }

  return (
    <div className="call-advisor-group">
      {usedCalls.map((used, i) => (
        <div className="call-advisor-wrap" key={i}>
          <span className="call-advisor-tooltip">{used ? 'Call Used' : 'Call Advisor'}</span>
          <button
            type="button"
            className={
              'call-advisor-btn' +
              (phase === 'ringing' && active === i ? ' ringing' : '') +
              (used ? ' used' : '')
            }
            aria-label={used ? 'Advisor call used' : 'Call advisor'}
            onClick={() => ring(i)}
          >
            <PhoneIcon />
          </button>
        </div>
      ))}
      {phase === 'talking' && (
        <div className="advisor-bubble">
          <p>
            {visible}
            {!done && <span className="type-caret type-caret--bubble" />}
          </p>
          {done && (
            <button type="button" className="dismiss-btn" onClick={dismiss}>
              Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  );
}
