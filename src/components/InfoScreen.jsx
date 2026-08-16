import { useEffect, useState } from 'react';
import { TitleBar } from './TitleBar.jsx';
import { NavFooter } from './NavFooter.jsx';
import { useDecodeLines } from '../useDecodeLines.js';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

// Shared shell for the read-only screens between setup and the first
// scenario: card + pixel heading + body copy + back/next footer.
//
// The copy decodes in on mount -- see useDecodeLines. Back/Next stay live
// throughout, and any click or keypress snaps the text to its final state.
export function InfoScreen({ label, heading, paragraphs, onBack, onNext }) {
  const [animate] = useState(() => !window.matchMedia?.(REDUCED_MOTION).matches);
  const { decoded, done, finish } = useDecodeLines(paragraphs, { active: animate });

  useEffect(() => {
    if (done) return undefined;
    document.addEventListener('pointerdown', finish);
    document.addEventListener('keydown', finish);
    return () => {
      document.removeEventListener('pointerdown', finish);
      document.removeEventListener('keydown', finish);
    };
  }, [done, finish]);

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <TitleBar label={label} />
        <div className="setup-body">
          <div className="setup-inner">
            <h1 className={animate ? 'pixel info-heading info-heading--boot' : 'pixel info-heading'}>
              {heading.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>

            <div className={animate && !done ? 'rules-text decoding' : 'rules-text'}>
              {/* A line that hasn't started yet still renders its final text,
                  hidden -- that holds its exact height so nothing below it
                  shifts as the paragraphs arrive. */}
              {decoded.map((line, i) => (
                <p key={i} className={line.started ? 'decode-line is-live' : 'decode-line'}>
                  {line.started ? line.text : paragraphs[i]}
                </p>
              ))}
            </div>
          </div>
        </div>
        <NavFooter onBack={onBack} onNext={onNext} />
      </div>
    </div>
  );
}
