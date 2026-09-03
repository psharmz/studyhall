import { useEffect, useRef, useState } from 'react';
import { VISION_CARD, VISION_CHAR_LIMIT } from '../scenarios.js';
import { AdvisorCall } from './AdvisorCall.jsx';
import { Gauge } from './Gauge.jsx';
import { PixelStudyHamsters } from '../pixels.jsx';
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

// Same clock as a scenario card, so the closing card does not feel like a
// different game. Nothing is scored here, so running out simply keeps whatever
// has been typed and moves on -- there is no penalty to apply.
const CARD_TIME = 90;
const TIMES_UP_HOLD_MS = 2600;

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`;
}

// The last card of every game: no options and no score, just the player's own
// answer in their own words. `initial` is whatever they wrote earlier this
// session, so a Study Mode run opens on the vision the simulation ended with.
export function VisionScreen({
  initial = '',
  timed = true,
  study = false,
  gaugeAngle,
  needleColor,
  sound = true,
  usedCalls,
  onUseCall,
  onAdvisorCall,
  onFinish,
}) {
  const [text, setText] = useState(initial);
  const [timeLeft, setTimeLeft] = useState(CARD_TIME);
  const [outOfTime, setOutOfTime] = useState(false);

  // Phone layout follows the scenario cards: the dial and clock move into the
  // story panel, and the advisors and the Finish button move to a fixed footer
  // within thumb reach.
  const [isPhone, setIsPhone] = useState(
    () => window.matchMedia?.('(max-width: 700px)').matches ?? false
  );
  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 700px)');
    if (!mq) return undefined;
    const onChange = (e) => setIsPhone(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // The latest text, for the timeout handoff -- it fires from a timer that
  // would otherwise close over whatever was typed when the clock started.
  const textRef = useRef(text);
  textRef.current = text;
  // One-shot, so StrictMode's double-invoked effects cannot finish twice.
  const timedOutRef = useRef(false);
  const holdTimer = useRef(null);

  useEffect(() => () => clearTimeout(holdTimer.current), []);

  useEffect(() => {
    if (!timed || outOfTime) return undefined;
    const interval = setInterval(() => setTimeLeft((t) => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(interval);
  }, [timed, outOfTime]);

  // Out of time: hold on "TIMES UP!" long enough to read, then submit whatever
  // is in the box -- including nothing, which is a valid answer here.
  useEffect(() => {
    if (!timed || timeLeft > 0 || timedOutRef.current) return;
    timedOutRef.current = true;
    setOutOfTime(true);
    holdTimer.current = setTimeout(() => onFinish(textRef.current), TIMES_UP_HOLD_MS);
  }, [timed, timeLeft]);

  const timerClass =
    'timer' + (outOfTime || timeLeft <= 10 ? ' timer-critical' : timeLeft <= 30 ? ' timer-warn' : '');

  const clock = <div className={timerClass}>{outOfTime ? '00:00' : formatTime(timeLeft)}</div>;

  const advisors = (
    <AdvisorCall
      advisors={VISION_CARD.advisors}
      sound={sound}
      usedCalls={usedCalls}
      onUseCall={onUseCall}
      onAdvisorCall={onAdvisorCall}
      unlimited={study}
      showRole={study}
    />
  );

  const finishButton = (
    <button
      type="button"
      className="action-btn"
      disabled={outOfTime}
      onClick={() => onFinish(text)}
    >
      Finish
    </button>
  );

  const remaining = VISION_CHAR_LIMIT - text.length;

  return (
    <div className={'screen-options screen-vision' + (outOfTime ? ' time-critical' : '')}>
      {outOfTime && <TimesUpOverlay />}
      <div className="layout-row top-row">
        <div className="card card--intro card--standalone">
          <div className="body">
            <h1 className="pixel">
              {VISION_CARD.titleLines[0]}
              <br />
              {VISION_CARD.titleLines[1]}
            </h1>
            {isPhone && timed && clock}
            <div className="content-row">
              <div className="story-text-wrap">
                {VISION_CARD.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            {/* On the green panel the dial stands alone and the needle goes
                black to read against it. Study Mode has no score to report,
                so it gets the reading room instead. */}
            {isPhone && (
              <div className="phone-gauge">
                {study ? (
                  <PixelStudyHamsters className="study-hamsters" />
                ) : (
                  <Gauge angle={gaugeAngle} needleColor="var(--black)" />
                )}
              </div>
            )}
            {!isPhone && advisors}
          </div>
        </div>
        {!isPhone && (
          <div className="card card--options card--standalone">
            <div className="body">
              {timed && clock}
              <Gauge angle={gaugeAngle} needleColor={needleColor} />
            </div>
          </div>
        )}
      </div>

      <div className="layout-row">
        <div className="card card--options card--standalone card--choices">
          <div className="body">
            <div className="vision-compose">
              <label className="vision-label" htmlFor="vision-input">
                Your vision
              </label>
              <textarea
                id="vision-input"
                className="vision-input"
                value={text}
                maxLength={VISION_CHAR_LIMIT}
                rows={3}
                disabled={outOfTime}
                placeholder="In your own words..."
                onChange={(e) => setText(e.target.value)}
              />
              <div className="vision-meta">
                {/* Nothing is required here -- an empty vision is a valid one. */}
                <span className="vision-hint">Optional. Nothing here is scored.</span>
                <span className={'vision-count' + (remaining <= 20 ? ' vision-count--low' : '')}>
                  {text.length}/{VISION_CHAR_LIMIT}
                </span>
              </div>
            </div>
            {!isPhone && finishButton}
          </div>
        </div>
      </div>

      {isPhone && (
        <div className="mobile-footer">
          <div className="mobile-footer-calls">
            <span className="mobile-footer-label">Call Adviser</span>
            {advisors}
          </div>
          {finishButton}
        </div>
      )}
    </div>
  );
}
