import { useEffect, useRef, useState } from 'react';
import { playRingTone, RING_TOTAL_MS } from '../ringtone.js';
import { SHOW_ADVISOR_ROLE, ADVISOR_PROFILES } from '../scenarios.js';
import { PhoneIcon } from '../pixels.jsx';

// Three advisor calls per game, spendable on any card. Tapping an unused
// phone rings it (only that icon animates); after the two rings the bubble
// opens and types the advisor response. Dismissing the bubble consumes the
// call: that icon gets a persistent slash for the rest of the game.
// Study mode has no such budget -- `unlimited` leaves every phone open --
// and is the only mode that names the advisor's role above the quote.
export function AdvisorCall({
  advisors,
  sound = true,
  usedCalls,
  onUseCall,
  onAdvisorCall,
  unlimited = false,
  showRole = true,
}) {
  const [phase, setPhase] = useState('idle'); // idle | ringing | talking
  const [active, setActive] = useState(null);
  const timerRef = useRef(null);
  // Each phone reaches its own advisor; the quote appears in full.
  const advisor = active === null ? null : advisors[active];
  // In study mode no phone ever reads as spent, so none get the slash.
  const spentCalls = unlimited ? usedCalls.map(() => false) : usedCalls;

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function ring(i) {
    if (phase !== 'idle' || (!unlimited && usedCalls[i])) return;
    // Reported at the ring rather than at the dismiss: a call that was placed
    // and then walked away from is still a call that was made.
    onAdvisorCall?.(i, advisors[i]);
    setActive(i);
    setPhase('ringing');
    // Sound off still rings visually -- same timing, no audio
    const ms = sound ? playRingTone() : RING_TOTAL_MS;
    timerRef.current = setTimeout(() => setPhase('talking'), ms + 150);
  }

  function dismiss() {
    if (!unlimited) onUseCall(active);
    setPhase('idle');
    setActive(null);
  }

  return (
    <div className="call-advisor-group">
      {spentCalls.map((used, i) => (
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
      {phase === 'talking' && advisor && (
        <div className="advisor-bubble">
          {SHOW_ADVISOR_ROLE && showRole && advisor.role && (
            <div className="advisor-role" data-tone={ADVISOR_PROFILES[advisor.role]?.tone}>
              <span className="advisor-role-name">{advisor.role}</span>
              {ADVISOR_PROFILES[advisor.role] && (
                <span className="advisor-motto">{ADVISOR_PROFILES[advisor.role].motto}</span>
              )}
            </div>
          )}
          <p>{advisor.quote}</p>
          <button type="button" className="dismiss-btn" onClick={dismiss}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
