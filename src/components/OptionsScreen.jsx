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

const CARD_TIME = 90;

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
  sound = true,
  usedCalls,
  onUseCall,
  onReveal,
  onTimeoutPenalty,
  onNext,
}) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(CARD_TIME);
  const [outOfTime, setOutOfTime] = useState(false);
  // Simulation Mode reveal, in steps: 0 = answering, 1 = panels fading and
  // gauge sliding to center, 2 = needle swinging + "next" button.
  const [revealStep, setRevealStep] = useState(0);
  const revealing = revealStep > 0;
  const selectedRef = useRef(null);
  selectedRef.current = selected;
  const revealingRef = useRef(false);
  revealingRef.current = revealing;
  const revealTimer = useRef(null);
  // Guards the one-shot timeout handoff against StrictMode's double effects
  const timedOutRef = useRef(false);

  useEffect(() => () => clearTimeout(revealTimer.current), []);

  // Countdown. The updater stays pure -- side effects here would run twice
  // under StrictMode and double-charge the timeout penalty.
  useEffect(() => {
    if (!timed) return undefined;
    const interval = setInterval(() => {
      if (revealingRef.current) {
        clearInterval(interval);
        return;
      }
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [scenario]);

  // Hitting zero: hold on "TIMES UP!" long enough for it to type out and
  // flash, then run the same reveal as a normal submit.
  useEffect(() => {
    if (!timed || timeLeft > 0 || timedOutRef.current) return;
    timedOutRef.current = true;
    setOutOfTime(true);
    revealTimer.current = setTimeout(() => beginReveal(selectedRef.current), 2600);
  }, [timed, timeLeft]);

  // Thresholds track CARD_TIME: amber for the last third, red for the last
  // ten seconds, glow for the final five.
  const timerClass =
    'timer' +
    (outOfTime || timeLeft <= 10 ? ' timer-critical' : timeLeft <= 30 ? ' timer-warn' : '');

  const alarm = timed && !outOfTime && !revealing && timeLeft <= 5;

  // Revealing with nothing picked: the clock ran out on an empty answer.
  const noAnswer = revealing && selected === null;

  // Simulation Mode: fade to black and glide the gauge to center first; only
  // once it has settled does the needle swing. A null index means the clock
  // ran out with nothing picked -- that costs the timeout penalty instead.
  function beginReveal(index) {
    const option = index === null ? null : scenario.options[index];
    setRevealStep(1);
    revealTimer.current = setTimeout(() => {
      if (option) onReveal(option);
      else onTimeoutPenalty();
      setRevealStep(2);
    }, 800);
  }

  function handleAction() {
    if (study) {
      if (!revealed) {
        setRevealed(true);
        onReveal(scenario.options[selected]);
      } else {
        onNext();
      }
      return;
    }
    // Once the reveal has settled the same button carries on to the next card.
    if (revealStep === 2) {
      onNext();
      return;
    }
    if (revealing) return;
    beginReveal(selected);
  }

  return (
    <div
      className={
        'screen-options' +
        (alarm ? ' time-critical' : '') +
        (revealing ? ' revealing' : '') +
        (revealStep === 2 ? ' reveal-settled' : '')
      }
    >
      {outOfTime && !revealing && <TimesUpOverlay />}
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
            <AdvisorCall
              advisors={scenario.advisors}
              sound={sound}
              usedCalls={usedCalls}
              onUseCall={onUseCall}
              unlimited={study}
              showRole={study}
            />
          </div>
        </div>
        <div className="card card--options card--standalone">
          <div className="body">
            {timed && !revealing && (
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
                      if (!outOfTime && !revealed && !revealing) setSelected(i);
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
            {noAnswer && (
              <p className="timeout-note">
                When you don&rsquo;t decide, someone will decide for you.
              </p>
            )}
            <button
              type="button"
              className="action-btn"
              disabled={revealStep === 2 ? false : selected === null || outOfTime || revealing}
              onClick={handleAction}
            >
              {(study ? revealed : revealStep === 2)
                ? isLast
                  ? 'Finish'
                  : 'Next Question'
                : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
