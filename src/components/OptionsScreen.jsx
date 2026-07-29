import { Fragment, useEffect, useRef, useState } from 'react';
import { LETTERS, ALIGN_LABELS } from '../scenarios.js';
import { AdvisorCall } from './AdvisorCall.jsx';
import { Gauge } from './Gauge.jsx';
import { useTypewriter } from '../useTypewriter.js';

function TimesUpOverlay() {
  const { visible, done } = useTypewriter('TIMES UP!', { speed: 90 });
  return (
    <div className="times-up-overlay">
      <div className={'times-up pixel' + (done ? ' times-up--flash' : '')}>
        {visible}
        {!done && <span className="type-caret type-caret--timesup" />}
      </div>
    </div>
  );
}

const CARD_TIME = 180;

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`;
}

export function OptionsScreen({
  scenario,
  timed = true,
  study = false,
  isLast = false,
  gaugeAngle,
  needleColor,
  usedCalls,
  onUseCall,
  onSubmit,
  onReveal,
  onNext,
}) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(CARD_TIME);
  const [outOfTime, setOutOfTime] = useState(false);
  const selectedRef = useRef(null);
  selectedRef.current = selected;

  // Countdown: on zero, count whatever is selected (or nothing) and move on,
  // mirroring the legacy prototype's out-of-time behavior.
  useEffect(() => {
    if (!timed) return undefined;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setOutOfTime(true);
          // Long enough for the "TIMES UP!" overlay to type out and flash
          setTimeout(() => {
            const sel = selectedRef.current;
            onSubmit(sel === null ? null : scenario.options[sel]);
          }, 2600);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [scenario]);

  const timerClass =
    'timer' +
    (outOfTime || timeLeft <= 20 ? ' timer-critical' : timeLeft <= 60 ? ' timer-warn' : '');

  const alarm = timed && !outOfTime && timeLeft <= 10;

  return (
    <div className={'screen-options' + (alarm ? ' time-critical' : '')}>
      {outOfTime && <TimesUpOverlay />}
      <div className="layout-row top-row">
        <div className="card card--intro card--standalone">
          <div className="body">
            <h1 className="pixel">
              {scenario.titleLines.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </h1>
            <div className="content-row">
              <div className="story-text-wrap">
                {scenario.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <AdvisorCall text={scenario.advisorText} usedCalls={usedCalls} onUseCall={onUseCall} />
          </div>
        </div>
        <div className="card card--options card--standalone">
          <div className="body">
            {timed && (
              <div className={timerClass}>{outOfTime ? '00:00' : formatTime(timeLeft)}</div>
            )}
            <Gauge angle={gaugeAngle} needleColor={needleColor} />
          </div>
        </div>
      </div>
      <div className="layout-row">
        <div className="card card--options card--standalone card--choices">
          <div className="body">
            <div
              className={
                'terminal' +
                (study ? ' terminal--study' : '') +
                (outOfTime || revealed ? ' locked' : '') +
                (revealed ? ' revealed' : '')
              }
            >
              <div className="terminal-bar">-bash &mdash; 534 x 532</div>
              <div className="options-row">
                {scenario.options.map((opt, i) => (
                  <div
                    key={i}
                    className={'option' + (selected === i ? ' selected' : '')}
                    style={{ animationDelay: `${0.45 + i * 0.12}s` }}
                    data-align={opt.align}
                    onClick={() => {
                      if (!outOfTime && !revealed) setSelected(i);
                    }}
                  >
                    <div className="option-face option-face--rest">
                      <span className="prompt">C:/ user_{LETTERS[i]}$</span>
                      <span className="text">{opt.text}</span>
                      {study && (
                        <div className="chip" data-align={opt.align}>
                          {ALIGN_LABELS[opt.align]}
                        </div>
                      )}
                    </div>
                    {study && <div className="option-face option-face--flip">{opt.explanation}</div>}
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="action-btn"
              disabled={selected === null || outOfTime}
              onClick={() => {
                if (!study) {
                  onSubmit(scenario.options[selected]);
                } else if (!revealed) {
                  setRevealed(true);
                  onReveal(scenario.options[selected]);
                } else {
                  onNext();
                }
              }}
            >
              {study && revealed ? (isLast ? 'Finish' : 'Next Question') : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
