import { useEffect, useMemo, useState } from 'react';
import { TitleBar } from './TitleBar.jsx';
import { NavFooter } from './NavFooter.jsx';
import { useDecodeLines } from '../useDecodeLines.js';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

// Shared shell for the read-only screens between setup and the first
// scenario: card + pixel heading + body copy + back/next footer.
//
// An entry in `paragraphs` is one of:
//   'text'              a plain paragraph
//   { icon, text }      a bordered cell with a pixel icon beside the copy
//   { window, lines }   a little pop-up window with its own chrome bar
//
// The copy decodes in on mount -- see useDecodeLines. Back/Next stay live
// throughout, and any click or keypress snaps the text to its final state.
export function InfoScreen({ label, heading, paragraphs, art, onBack, onNext }) {
  const [animate] = useState(() => !window.matchMedia?.(REDUCED_MOTION).matches);

  // The decoder animates one flat list of strings, so the blocks are
  // flattened for it and each remembers where its lines landed. Memoised:
  // useDecodeLines keys its timer off this array's identity, so building a
  // fresh one each render would restart the reveal on every tick.
  const { lines, blocks } = useMemo(() => {
    const flat = [];
    const built = paragraphs.map((p) => {
      if (typeof p === 'string') return { kind: 'text', at: flat.push(p) - 1 };
      if (p.window) {
        const at = flat.length;
        p.lines.forEach((l) => flat.push(l));
        return { kind: 'window', title: p.window, at, count: p.lines.length };
      }
      return { kind: 'item', icon: p.icon, at: flat.push(p.text) - 1 };
    });
    return { lines: flat, blocks: built };
  }, [paragraphs]);

  const { decoded, done, finish } = useDecodeLines(lines, { active: animate });

  useEffect(() => {
    if (done) return undefined;
    document.addEventListener('pointerdown', finish);
    document.addEventListener('keydown', finish);
    return () => {
      document.removeEventListener('pointerdown', finish);
      document.removeEventListener('keydown', finish);
    };
  }, [done, finish]);

  // A line that hasn't started yet still renders its final text, hidden --
  // that holds its exact height so nothing below it shifts as copy arrives.
  function readLine(i) {
    const d = decoded[i];
    return {
      started: d.started,
      cls: d.started ? 'decode-line is-live' : 'decode-line',
      text: d.started ? d.text : lines[i],
    };
  }

  return (
    <div className="setup-screen">
      <div className="setup-card setup-card--info">
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
              {blocks.map((block, i) => {
                if (block.kind === 'text') {
                  const l = readLine(block.at);
                  return (
                    <p key={i} className={l.cls}>
                      {l.text}
                    </p>
                  );
                }

                if (block.kind === 'item') {
                  const l = readLine(block.at);
                  const Icon = block.icon;
                  // The cell carries the arrival class so its border and icon
                  // appear with the line rather than ahead of it.
                  return (
                    <div key={i} className={`consent-item ${l.cls}`}>
                      <Icon className="consent-item-icon" />
                      <p>{l.text}</p>
                    </div>
                  );
                }

                // The frame arrives with its first line; the rest of the copy
                // then decodes inside it, window by window down the screen.
                const opened = readLine(block.at).started;
                return (
                  <section key={i} className={opened ? 'info-window is-live' : 'info-window'}>
                    <div className="info-window-bar">
                      <div className="icons">
                        <span>&#x2612;</span>
                        <span>&minus;</span>
                        <span>+</span>
                      </div>
                      <div className="label">{block.title}</div>
                    </div>
                    <div className="info-window-body">
                      {Array.from({ length: block.count }, (_, k) => {
                        const l = readLine(block.at + k);
                        return (
                          <p key={k} className={l.cls}>
                            {l.text}
                          </p>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Optional illustration, sitting under the copy. */}
            {art}
          </div>
        </div>
        <NavFooter onBack={onBack} onNext={onNext} />
      </div>
    </div>
  );
}
