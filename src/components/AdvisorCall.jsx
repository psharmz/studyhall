import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { playRingTone, RING_TOTAL_MS } from '../ringtone.js';
import { SHOW_ADVISOR_ROLE, ADVISOR_PROFILES } from '../scenarios.js';
import { PhoneIcon } from '../pixels.jsx';

// Three advisor calls per game, spendable on any card. Tapping an unused
// phone rings it (only that icon animates); after the two rings the bubble
// opens and types the advisor response. Reaching the advisor consumes the
// call -- the moment the quote is on screen that icon gets a persistent slash
// for the rest of the game, whether or not the bubble is ever dismissed.
// Study mode has no such budget -- `unlimited` leaves every phone open --
// and is the only mode that names the advisor's role above the quote.

// Where the bubble's tail sits inside it by default, measured to its centre:
// 16px in from the edge plus half the 7px triangle. Used as the offset that
// puts the tail over the phone that was called.
const TAIL_INSET = 23;
// Keeps the bubble off the very edge of a narrow screen.
const EDGE_MARGIN = 8;

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
  // Measured placement for the open bubble: where it sits, and where its tail
  // points. Null until it has been measured -- see the layout effect below.
  const [placement, setPlacement] = useState(null);
  const groupRef = useRef(null);
  const bubbleRef = useRef(null);
  const btnRefs = useRef([]);
  // Index of a call that has been placed but not yet charged, so the ring can
  // be interrupted (card advances mid-ring) without the call coming back.
  const pendingRef = useRef(null);
  // Each phone reaches its own advisor; the quote appears in full.
  const advisor = active === null ? null : advisors[active];
  // In study mode no phone ever reads as spent, so none get the slash.
  const spentCalls = unlimited ? usedCalls.map(() => false) : usedCalls;

  // A call that was placed and then cut short by the card advancing is still
  // spent, so the unmount charges anything left pending.
  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
      chargeCall();
    },
    [],
  );

  function chargeCall() {
    if (pendingRef.current === null) return;
    onUseCall(pendingRef.current);
    pendingRef.current = null;
  }

  function ring(i) {
    if (phase !== 'idle' || (!unlimited && usedCalls[i])) return;
    // Reported at the ring rather than at the dismiss: a call that was placed
    // and then walked away from is still a call that was made.
    onAdvisorCall?.(i, advisors[i]);
    if (!unlimited) pendingRef.current = i;
    setActive(i);
    setPhase('ringing');
    // Sound off still rings visually -- same timing, no audio
    const ms = sound ? playRingTone() : RING_TOTAL_MS;
    timerRef.current = setTimeout(() => {
      setPhase('talking');
      // The advisor has spoken: the call is spent from here on.
      chargeCall();
    }, ms + 150);
  }

  function dismiss() {
    setPhase('idle');
    setActive(null);
  }

  // The bubble opens over the phone that was actually called rather than over
  // the first one, so which advisor is speaking is obvious without reading the
  // quote. Measured rather than derived from the index: the phones are a
  // different size on the mobile footer, and the group is laid out with a gap
  // that only CSS knows about.
  //
  // A layout effect, so the bubble is positioned in the same frame it appears
  // -- doing it after paint would show it at the left edge for a frame first.
  useLayoutEffect(() => {
    if (phase !== 'talking' || active === null) {
      setPlacement(null);
      return;
    }
    const group = groupRef.current;
    const bubble = bubbleRef.current;
    const button = btnRefs.current[active];
    if (!group || !bubble || !button) return;

    const groupBox = group.getBoundingClientRect();
    const buttonBox = button.getBoundingClientRect();
    const width = bubble.offsetWidth;
    // Both offsets are relative to the group, which is what the bubble is
    // positioned against.
    const centre = buttonBox.left + buttonBox.width / 2 - groupBox.left;

    // Clamped to the viewport: on a phone the bubble is wider than the footer
    // it hangs off, so anchoring the third handset would push it off screen.
    const min = EDGE_MARGIN - groupBox.left;
    const max = window.innerWidth - EDGE_MARGIN - width - groupBox.left;
    const left = Math.min(Math.max(centre - TAIL_INSET, min), Math.max(min, max));
    // The tail follows the phone even when the bubble itself had to be pulled
    // back, but never past the bubble's own corners.
    const tail = Math.min(Math.max(centre - left, TAIL_INSET), width - TAIL_INSET);
    setPlacement({ left, tail });
  }, [phase, active]);

  return (
    <div className="call-advisor-group" ref={groupRef}>
      {spentCalls.map((used, i) => (
        <div className="call-advisor-wrap" key={i}>
          <span className="call-advisor-tooltip">{used ? 'Call Used' : 'Call Advisor'}</span>
          <button
            type="button"
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
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
        <div
          className="advisor-bubble"
          ref={bubbleRef}
          style={
            placement
              ? { left: `${placement.left}px`, '--advisor-tail-x': `${placement.tail}px` }
              : undefined
          }
        >
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
