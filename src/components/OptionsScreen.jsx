import { Fragment, useEffect, useRef, useState } from 'react';
import {
  captureClarityRated,
  captureLearnBeyondOpened,
  captureScenarioFeedbackSubmitted,
  CLARITY_SCALE,
} from '../telemetry.js';
import { LETTERS, ALIGN_LABELS } from '../scenarios.js';
import { GENERAL_RESOURCES, SCENARIO_RESOURCES } from '../resources.js';
import { AdvisorCall } from './AdvisorCall.jsx';
import { Gauge } from './Gauge.jsx';
import { PixelStudyHamsters } from '../pixels.jsx';
import { useTypewriter } from '../useTypewriter.js';
import { useIsPhone } from '../useIsPhone.js';

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
  simulationAnswers = {},
  questionNumber,
  // Phone, Simulation Mode: the card opens as a reading screen and the deck is
  // dealt in place when the player asks for it. False means the prompt is up
  // but the answers are not -- no clock running, nothing to swipe. Every other
  // layout arms immediately, which is the old behaviour.
  armed = true,
  onArm,
  onUseCall,
  onAdvisorCall,
  onReveal,
  onTimeoutPenalty,
  onNext,
}) {
  const [selected, setSelected] = useState(null);
  const [clarity, setClarity] = useState(0); // 1 = confusing, 2 = unsure, 3 = clear
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [learnBeyondOpen, setLearnBeyondOpen] = useState(false);
  const isPhone = useIsPhone();

  // Phone deck: cards stacked like a hand of cards, top one swipeable.
  const [order, setOrder] = useState(() => scenario.options.map((_, i) => i));
  const [drag, setDrag] = useState({ x: 0, active: false });
  const dragStart = useRef(0);

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
    if (!timed || !armed) return undefined;
    const interval = setInterval(() => {
      if (revealingRef.current) {
        clearInterval(interval);
        return;
      }
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [scenario, timed, armed]);

  // Hitting zero: hold on "TIMES UP!" long enough for it to type out and
  // flash, then run the same reveal as a normal submit.
  useEffect(() => {
    if (!timed || !armed || timeLeft > 0 || timedOutRef.current) return;
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
      if (option) onReveal(option, index);
      else onTimeoutPenalty();
      setRevealStep(2);
    }, 800);
  }

  // Drag the top card sideways; past the threshold it goes to the back of
  // the stack and the next one comes up.
  function onCardDown(e) {
    if (revealing || revealed || outOfTime) return;
    dragStart.current = e.clientX;
    setDrag({ x: 0, active: true });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function onCardMove(e) {
    if (!drag.active) return;
    setDrag({ x: e.clientX - dragStart.current, active: true });
  }

  function onCardUp() {
    if (!drag.active) return;
    if (Math.abs(drag.x) > 70) setOrder((o) => [...o.slice(1), o[0]]);
    setDrag({ x: 0, active: false });
  }

  function handleFeedbackSubmit() {
    const text = feedback.trim();
    if (!text) return;
    captureScenarioFeedbackSubmitted({
      scenarioCode: scenario.code,
      questionNumber,
      rating: clarity,
      text,
    });
    setFeedbackSent(true);
  }

  function handleClarityRating(star) {
    setClarity(star);
    captureClarityRated({
      scenarioCode: scenario.code,
      questionNumber,
      rating: star,
    });
  }

  function trackLearnMore() {
    captureLearnBeyondOpened({ scenarioCode: scenario.code, questionNumber });
  }

  function openLearnBeyond() {
    trackLearnMore();
    setLearnBeyondOpen(true);
  }

  const learnResources = SCENARIO_RESOURCES[scenario.code] ?? [];

  // Always the panel, whatever the scenario has of its own: the general EJIT
  // reading is listed underneath, so there is never a lone link that would be
  // better opened directly.
  function learnMoreControl(className, tabIndex) {
    return (
      <button type="button" className={className} onClick={openLearnBeyond} tabIndex={tabIndex}>
        Learn More
      </button>
    );
  }

  // One resource, rendered the same way in either section of the panel.
  function learnItem(r) {
    return (
      <li key={r.url}>
        <a className="learn-item" href={r.url} target="_blank" rel="noopener noreferrer">
          {/* The site's own icon. It can 404, so it is hidden on error
              rather than left as a broken image. */}
          <img
            className="learn-item-icon"
            src={`https://${r.domain}/favicon.ico`}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden';
            }}
          />
          <span className="learn-item-text">
            <span className="learn-item-title">{r.title}</span>
            {r.blurb && <span className="learn-item-blurb">{r.blurb}</span>}
            <span className="learn-item-domain">{r.domain}</span>
          </span>
        </a>
      </li>
    );
  }

  function handleAction() {
    if (study) {
      if (!revealed) {
        setRevealed(true);
        onReveal(scenario.options[selected], selected);
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

  // Study Mode's answer sheet. In the side panel on desktop it stands where
  // the reading room was, so the row keeps its height across the reveal; on
  // a phone there is no side panel, so it stays under the options.
  // The principle is written onto the board once the answer lands.
  const typed = useTypewriter(scenario.principle ?? '', {
    active: study && revealed && !!scenario.principle,
    speed: 16,
  });

  // The three faces replace the old five stars, so the scale runs 1-3:
  // 1 = confusing, 2 = unsure, 3 = clear.
  // A five-point scale rather than three: an odd-numbered Likert with two
  // steps either side of neutral is what makes the responses worth analysing,
  // where three points collapsed most of the signal.
  const CLARITY_FACES = [
    {
      value: 1,
      face: '\u{1F616}',
      label: CLARITY_SCALE[1],
      prompt: 'What was confusing? Tell us more',
    },
    {
      value: 2,
      face: '\u{1F615}',
      label: CLARITY_SCALE[2],
      prompt: 'What was confusing? Tell us more',
    },
    {
      value: 3,
      face: '\u{1F610}',
      label: CLARITY_SCALE[3],
      prompt: 'What would make it clearer?',
    },
    {
      value: 4,
      face: '\u{1F642}',
      label: CLARITY_SCALE[4],
      prompt: "Anything else you'd like to share?",
    },
    {
      value: 5,
      face: '\u{1F604}',
      label: CLARITY_SCALE[5],
      prompt: "Anything else you'd like to share?",
    },
  ];

  const pickedFace = CLARITY_FACES.find((f) => f.value === clarity);

  // Opens once a face is picked; the prompt is the one that face carries.
  const feedbackBox = pickedFace ? (
    <div className="study-feedback">
      <textarea
        className="study-feedback-input"
        value={feedback}
        placeholder={pickedFace.prompt}
        aria-label={pickedFace.prompt}
        onChange={(e) => {
          setFeedback(e.target.value);
          setFeedbackSent(false);
        }}
      />
      {/* Once it has gone, the control is replaced by a plain confirmation --
          there is nothing left to press. */}
      {feedbackSent ? (
        <span className="study-feedback-sent" role="status">
          <span aria-hidden="true">&#10003;</span> Sent
        </span>
      ) : (
        <button
          type="button"
          className="study-feedback-send"
          disabled={!feedback.trim()}
          onClick={handleFeedbackSubmit}
        >
          Send
        </button>
      )}
    </div>
  ) : null;

  const clarityBlock = (
    <div className="clarity-rating">
      <label htmlFor="clarity-faces">How clear is this scenario to you?</label>
      <div className="study-faces" id="clarity-faces">
        {CLARITY_FACES.map(({ value, face, label }) => (
          <button
            key={value}
            type="button"
            className={`study-face${clarity === value ? ' is-picked' : ''}`}
            onClick={() => handleClarityRating(value)}
            title={label}
            aria-label={label}
            aria-pressed={clarity === value}
          >
            <span className="study-face-emoji">{face}</span>
            <span className="study-face-label">{label}</span>
          </button>
        ))}
      </div>
      {feedbackBox}
    </div>
  );

  const actionsBlock = (
    <div className="btn-row principle-actions">
      {learnMoreControl('btn btn--secondary')}
    </div>
  );

  // A phone has no side panel, so the answer sheet stays under the options
  // in its old shape.
  const principlePanel =
    study && revealed && scenario.principle ? (
      <div className="principle">
        <div className="principle-inner">
          <span className="principle-label">EJIT Principle</span>
          <p className="principle-text">{scenario.principle}</p>
          {clarityBlock}
          {actionsBlock}
        </div>
      </div>
    ) : null;

  return (
    <div
      className={
        'screen-options' +
        (noAnswer ? ' no-answer' : '') +
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
            {isPhone && timed && armed && !revealing && (
              <div className={timerClass}>{outOfTime ? '00:00' : formatTime(timeLeft)}</div>
            )}
            <div className="content-row">
              <div className="story-text-wrap">
                {scenario.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            {/* On the green panel the dial stands alone -- no wheel, no
                hamsters -- and the needle goes black to read against it.
                Study Mode has no score to report, so it gets the reading
                room instead. */}
            {isPhone && (
              <div className="phone-gauge">
                {study ? (
                  <PixelStudyHamsters className="study-hamsters" />
                ) : (
                  /* The needle keeps the game's blue here rather than going
                     black against the green panel. */
                  <Gauge angle={gaugeAngle} needleColor={needleColor} />
                )}
              </div>
            )}
            {/* Study Mode keeps the dial, but as a readout pinned in the
                green panel's corner -- no wheel, no hamsters, just the
                needle. */}
            {study && !isPhone && (
              <div className="gauge-wrap gauge-pin gauge-pin--story">
                <Gauge angle={gaugeAngle} needleColor="var(--black)" />
              </div>
            )}
            {!isPhone && (
              <AdvisorCall
                advisors={scenario.advisors}
                sound={sound}
                usedCalls={usedCalls}
                onUseCall={onUseCall}
                onAdvisorCall={onAdvisorCall}
                unlimited={study}
                showRole={study}
              />
            )}
          </div>
        </div>
        {!isPhone && (
          <div className="card card--options card--standalone">
            <div className="body">
              {timed && !revealing && (
                <div className={timerClass}>{outOfTime ? '00:00' : formatTime(timeLeft)}</div>
              )}
              {study ? (
                /* One fixed-height slot for both states, so the row does not
                   change height when the answer is revealed. */
                /* One fixed-height stage for both states. The scene fades
                   out while the board grows out of it and takes the left
                   side; the rating fades in beside it. */
                <div className={'study-slot' + (revealed ? ' is-revealed' : '')}>
                  <PixelStudyHamsters className="study-hamsters" />
                  <div className="study-board" aria-hidden={!revealed}>
                    <span className="principle-label">EJIT Principle</span>
                    <p className="study-board-text">
                      {typed.visible}
                      {revealed && !typed.done && <span className="type-caret" />}
                    </p>
                    {learnMoreControl('study-board-learn', revealed ? 0 : -1)}
                  </div>
                  <div className="study-answer">{clarityBlock}</div>
                </div>
              ) : (
                <Gauge angle={gaugeAngle} needleColor={needleColor} />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="layout-row">
        <div className="card card--options card--standalone card--choices">
          <div className="body">
            {isPhone && principlePanel}
            <div
              className={
                'terminal' +
                (study ? ' terminal--study' : '') +
                (outOfTime || revealed ? ' locked' : '') +
                (revealed ? ' revealed' : '')
              }
            >
              <div className="terminal-bar">-bash &mdash; 534 x 532</div>
              {!armed ? (
                /* The deck's own slot, holding the invitation to deal it. The
                   panel above does not move when this swaps for the cards --
                   same screen, same component, same DOM node. */
                <div className="deal-slot">
                  <button type="button" className="deal-btn" onClick={onArm}>
                    Answer Question
                  </button>
                  <p className="deal-hint">The clock starts when you do</p>
                </div>
              ) : (
              <div className={isPhone ? 'options-row options-deck' : 'options-row'}>
                {scenario.options.map((opt, i) => {
                  const depth = isPhone ? order.indexOf(i) : 0;
                  const top = depth === 0;
                  // Fanned hard rather than squared up: the cards behind the
                  // top one lean alternately left and right, far enough that
                  // each one is plainly visible under the card in hand.
                  const tilt = [0, -11, 8.5, -6, 4][depth] ?? 0;
                  const deckStyle = isPhone
                    ? {
                        zIndex: scenario.options.length - depth,
                        transform: `translate3d(${top ? drag.x : 0}px, ${depth * 11}px, 0) rotate(${
                          top ? drag.x / 16 : tilt
                        }deg) scale(${1 - depth * 0.028})`,
                        transition: drag.active && top ? 'none' : 'transform .22s ease',
                        pointerEvents: top ? 'auto' : 'none',
                      }
                    : { animationDelay: `${0.45 + i * 0.12}s` };
                  return (
                  <div
                    key={i}
                    className={
                      'option' +
                      (selected === i ? ' selected' : '') +
                      (isPhone && top ? ' is-top' : '')
                    }
                    style={deckStyle}
                    onPointerDown={isPhone && top ? onCardDown : undefined}
                    onPointerMove={isPhone && top ? onCardMove : undefined}
                    onPointerUp={isPhone && top ? onCardUp : undefined}
                    onPointerCancel={isPhone && top ? onCardUp : undefined}
                    data-align={opt.align}
                    onClick={
                      isPhone
                        ? undefined
                        : () => {
                            if (!outOfTime && !revealed && !revealing) setSelected(i);
                          }
                    }
                  >
                    <div className="option-face option-face--rest">
                      <span className="prompt">C:/ user_{LETTERS[i]}$</span>
                      <span className="text">{opt.text}</span>
                      {study && (
                        <div className="option-tags">
                          {simulationAnswers[scenario.code] === opt && (
                            <div className="chip" data-align="simulation">
                              Selected in simulation mode
                            </div>
                          )}
                          <div className="chip" data-align={opt.align}>
                            {ALIGN_LABELS[opt.align]}{' '}
                            <b className="chip-score">
                              {opt.score > 0 ? `+${opt.score}` : opt.score}
                            </b>
                          </div>
                        </div>
                      )}
                    </div>
                    {study && <div className="option-face option-face--flip">{opt.explanation}</div>}
                    {isPhone && !revealed && !revealing && !outOfTime && (
                      <button
                        type="button"
                        className="option-select"
                        aria-pressed={selected === i}
                        onClick={() => setSelected(i)}
                      >
                        {selected === i ? `Selected ${LETTERS[i]}` : 'Select'}
                      </button>
                    )}
                  </div>
                  );
                })}
              </div>
              )}
            </div>
            {noAnswer && (
              <>
                <p className="timeout-note">
                  When you don&rsquo;t decide, someone will decide for you.
                </p>
                {isPhone && (
                  <button type="button" className="action-btn timeout-next" onClick={handleAction}>
                    {isLast ? 'Finish' : 'Next Question'}
                  </button>
                )}
              </>
            )}
            {!isPhone && (
              <button
                type="button"
                className="action-btn"
                disabled={revealStep === 2 ? false : selected === null || outOfTime || revealing}
                onClick={handleAction}
              >
                {(study ? revealed : revealStep === 2) ? (isLast ? 'Finish' : 'Next Question') : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
      {isPhone && armed && !noAnswer && (
        <div className="mobile-footer">
          <div className="mobile-footer-calls">
            <span className="mobile-footer-label">Call Adviser</span>
            <AdvisorCall
              advisors={scenario.advisors}
              sound={sound}
              usedCalls={usedCalls}
              onUseCall={onUseCall}
              onAdvisorCall={onAdvisorCall}
              unlimited={study}
              showRole={study}
            />
          </div>
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
              : selected !== null
              ? `Submit ${LETTERS[selected]}`
              : 'Submit'}
          </button>
        </div>
      )}
      {learnBeyondOpen && (
        <div className="learn-beyond-overlay" onClick={() => setLearnBeyondOpen(false)}>
          <div className="learn-beyond-panel" onClick={(e) => e.stopPropagation()}>
            <div className="learn-beyond-header">
              <h2>Learn More</h2>
              <button
                type="button"
                className="learn-beyond-close"
                onClick={() => setLearnBeyondOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="learn-beyond-content">
              {learnResources.length === 0 ? (
                <p className="learn-empty">
                  Reading for this scenario is still being gathered.
                </p>
              ) : (
                <ul className="learn-list">{learnResources.map(learnItem)}</ul>
              )}

              <h3 className="learn-section-head">General resources about EJIT</h3>
              <ul className="learn-list">{GENERAL_RESOURCES.map(learnItem)}</ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
