import { useEffect, useRef, useState } from 'react';
import {
  captureAdvisorCalled,
  captureCategoryScores,
  captureGoalWordsSubmitted,
  captureQuestionAnswered,
  captureResultsJumped,
  captureRunAbandoned,
  captureRunCompleted,
  captureScreenExited,
  startRun,
} from './telemetry.js';
import { RADAR_AXES, RADAR_SCORES_ARE_PLACEHOLDER, axisScore } from './components/ResultsCharts.jsx';
import { SCENARIOS, SCORE_MIN, SCORE_MAX, LETTERS, ADVISOR_PROFILES } from './scenarios.js';
import { DEV_MODE } from './env.js';
import { SetupScreen } from './components/SetupScreen.jsx';
import { RulesScreen } from './components/RulesScreen.jsx';
import { GoalsScreen } from './components/GoalsScreen.jsx';
import { ConsentScreen } from './components/ConsentScreen.jsx';
import { StudyIntroScreen } from './components/StudyIntroScreen.jsx';
import { StudyPreviewScreen } from './components/StudyPreviewScreen.jsx';
import { ReflectionScreen } from './components/ReflectionScreen.jsx';
import { PromptTransition } from './components/PromptTransition.jsx';
import { PromptScreen } from './components/PromptScreen.jsx';
import { OptionsScreen } from './components/OptionsScreen.jsx';
import { CompleteScreen } from './components/CompleteScreen.jsx';

// The needle reads blue on every gauge, whatever the answer's alignment --
// the arc's own bands carry the good/bad signal.
const NEEDLE_COLOR = 'var(--blue)';

// Needle sweeps +75deg (pointing right, into the red zone) at SCORE_MIN
// down to -75deg (pointing left, into the green zone) at SCORE_MAX.
const NEEDLE_SWEEP = 75;

// Letting the clock run out with no answer picked swings the needle an
// eighth of the dial's full travel towards non-aligned.
const TIMEOUT_PENALTY = (SCORE_MAX - SCORE_MIN) / 8;

// Shortcut menu on the results button: each band parks the needle in the
// middle of that stretch of the dial. Fractions run 0 = non-aligned (red,
// far right) to 1 = fully aligned (green, far left); the colours are the
// arc's own.
const RESULT_BANDS = [
  { name: 'Green', color: '#3f9142', fraction: 0.875 },
  { name: 'Yellow', color: '#f2c94c', fraction: 0.625 },
  { name: 'Orange', color: '#ef8b2c', fraction: 0.375 },
  { name: 'Red', color: '#e0453f', fraction: 0.125 },
];

// The phases that belong to a specific card. Screen timings for these carry
// the scenario they were spent on; the rest carry null.
const SCENARIO_PHASES = new Set(['transition', 'prompt', 'options']);

function scoreToAngle(score) {
  // Clamped: repeated timeouts can push the total past SCORE_MIN, and the
  // needle should stop at the end of the dial rather than swing off it.
  const raw = (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
  const fraction = Math.min(1, Math.max(0, raw));
  return NEEDLE_SWEEP - fraction * (NEEDLE_SWEEP * 2);
}

export default function App() {
  // setup | rules | goals | studyPreview | consent | reflect | transition | prompt | options | complete
  const [phase, setPhase] = useState('setup');
  // The words the player picks for their own definition of Environmental
  // Justice in Technology. Kept here so they survive a trip back to the rules.
  const [reflectionWords, setReflectionWords] = useState([]);
  const [settings, setSettings] = useState(null); // { language, mode, cards }
  const [index, setIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  // Three advisor calls per game, spendable on any card
  const [usedCalls, setUsedCalls] = useState([false, false, false]);
  // What was picked on each card, keyed by scenario code. Feeds the results
  // screen, where hovering a scenario chip shows the answer and its debrief.
  const [answers, setAnswers] = useState({});
  // Track which answers were chosen in simulation mode, to tag them in study mode
  const [simulationAnswers, setSimulationAnswers] = useState({});
  // Band picker under the results shortcut.
  const [bandsOpen, setBandsOpen] = useState(false);
  const bandsRef = useRef(null);

  // Telemetry bookkeeping. All refs -- none of it is rendered, and a re-render
  // per captured event would be a lot of churn for nothing.
  const screenRef = useRef(null);
  const questionStartRef = useRef(0);
  const runStartRef = useRef(0);
  // Advisors called on the card currently open, so the answer event can report
  // what was spent on it. Cleared once that answer is captured.
  const questionCallsRef = useRef([]);
  const runCallCountRef = useRef(0);
  const answeredCountRef = useRef(0);
  const timeoutCountRef = useRef(0);

  // Any click outside the menu closes it, the way a native select would.
  useEffect(() => {
    if (!bandsOpen) return undefined;
    function onDocClick(e) {
      if (!bandsRef.current?.contains(e.target)) setBandsOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setBandsOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [bandsOpen]);

  // Only 5 scenarios exist so far; picking 10 or 20 cards plays all of them.
  const deck = settings ? SCENARIOS.slice(0, settings.cards) : SCENARIOS;
  const scenario = deck[Math.min(index, deck.length - 1)];
  const questionNumber = index + 1;

  // One screen_exited row per screen visit, emitted on the way out with how
  // long it was open. Comparing against the ref rather than using an effect
  // cleanup keeps StrictMode's double-invoked effects from reporting a phantom
  // zero-length visit on mount.
  useEffect(() => {
    const now = performance.now();
    const onCard = SCENARIO_PHASES.has(phase);
    const current = {
      name: phase,
      at: now,
      scenarioCode: onCard ? scenario?.code ?? null : null,
      questionNumber: onCard ? questionNumber : null,
    };
    const previous = screenRef.current;
    if (
      previous &&
      previous.name === current.name &&
      previous.questionNumber === current.questionNumber
    ) {
      return;
    }
    if (previous) {
      captureScreenExited({
        screenName: previous.name,
        nextScreen: current.name,
        durationMs: Math.round(now - previous.at),
        scenarioCode: previous.scenarioCode,
        questionNumber: previous.questionNumber,
      });
    }
    screenRef.current = current;
    // Time-to-answer is measured from the moment the options come up, so it is
    // the deciding time on its own -- reading the prompt is its own screen.
    if (phase === 'options') questionStartRef.current = now;
  }, [phase, index]);

  function handleStart(chosen, runContext) {
    startRun(chosen, runContext);
    runStartRef.current = performance.now();
    questionCallsRef.current = [];
    runCallCountRef.current = 0;
    answeredCountRef.current = 0;
    timeoutCountRef.current = 0;
    setSettings(chosen);
    setIndex(0);
    setTotalScore(0);
    setUsedCalls([false, false, false]);
    setAnswers({});
    // Study Mode never sees the how-to-play rules -- it is a second pass, so
    // it opens on its own intro instead.
    setPhase(chosen.mode === 'study' ? 'studyIntro' : 'rules');
  }

  function advance() {
    if (index < deck.length - 1) {
      setIndex(index + 1);
      setPhase('transition');
    } else {
      captureRunCompleted({
        deckSize: deck.length,
        questionsAnsweredCount: answeredCountRef.current,
        timeoutCount: timeoutCountRef.current,
        advisorCallCount: runCallCountRef.current,
        totalScore,
        scoreMin: SCORE_MIN,
        scoreMax: SCORE_MAX,
        durationMs: Math.round(performance.now() - runStartRef.current),
      });
      captureCategoryScores({
        categories: RADAR_AXES.map((axis) => ({
          slug: axis.slug,
          score: axisScore(axis, answers),
          max: axis.max,
        })),
        totalScore,
        scoreMin: SCORE_MIN,
        scoreMax: SCORE_MAX,
        isPlaceholder: RADAR_SCORES_ARE_PLACEHOLDER,
      });
      setPhase('complete');
    }
  }

  // Scoring happens at reveal so the needle can swing while the answer is
  // still on screen; advancing is a separate, later step.
  function handleReveal(option, optionIndex) {
    answeredCountRef.current += 1;
    captureQuestionAnswered({
      scenarioCode: scenario.code,
      questionNumber,
      optionLetter: LETTERS[optionIndex],
      optionIndex,
      optionAlignment: option.align,
      optionScore: option.score,
      isTimeout: false,
      pointsApplied: option.score,
      timeToAnswerMs: Math.round(performance.now() - questionStartRef.current),
      totalScoreAfter: totalScore + option.score,
      advisorCallCount: questionCallsRef.current.length,
      advisorRoles: questionCallsRef.current.map((call) => call.role),
    });
    questionCallsRef.current = [];
    setTotalScore((t) => t + option.score);
    setAnswers((a) => ({ ...a, [scenario.code]: option }));
  }

  // Out of time with nothing picked -- no answer to score, just the penalty.
  function handleTimeoutPenalty() {
    timeoutCountRef.current += 1;
    captureQuestionAnswered({
      scenarioCode: scenario.code,
      questionNumber,
      optionLetter: null,
      optionIndex: null,
      optionAlignment: null,
      optionScore: null,
      isTimeout: true,
      pointsApplied: -TIMEOUT_PENALTY,
      timeToAnswerMs: Math.round(performance.now() - questionStartRef.current),
      totalScoreAfter: totalScore - TIMEOUT_PENALTY,
      advisorCallCount: questionCallsRef.current.length,
      advisorRoles: questionCallsRef.current.map((call) => call.role),
    });
    questionCallsRef.current = [];
    setTotalScore((t) => t - TIMEOUT_PENALTY);
  }

  function handleNext() {
    advance();
  }

  // Shortcut straight to the results screen with the needle parked in the
  // chosen band, whatever has been answered so far.
  // `band` is null in Study Mode, where the results screen has only one
  // version and there is no needle to park.
  function handleSkipToResults(band) {
    // A dev shortcut, not a played run: the jump is reported on its own event
    // and no score, run_completed or category total follows it.
    captureResultsJumped({
      bandName: band?.name ?? null,
      bandFraction: band?.fraction ?? null,
      fromScreen: phase,
    });
    if (band) setTotalScore(SCORE_MIN + band.fraction * (SCORE_MAX - SCORE_MIN));
    setBandsOpen(false);
    setPhase('complete');
  }

  // A phone was picked up on the card currently open. Counted at the ring, so a
  // call that was rung and then abandoned still counts as a call that was made.
  function handleAdvisorCall(advisorIndex, advisor) {
    questionCallsRef.current = [
      ...questionCallsRef.current,
      { index: advisorIndex, role: advisor?.role ?? null },
    ];
    runCallCountRef.current += 1;
    captureAdvisorCalled({
      scenarioCode: scenario.code,
      questionNumber,
      advisorIndex,
      advisorRole: advisor?.role,
      advisorTone: ADVISOR_PROFILES[advisor?.role]?.tone,
      isUnlimited: isStudy,
      callsAvailable: isStudy ? null : usedCalls.filter((used) => !used).length,
    });
  }

  // The floating Restart button drops the run on the floor. Reported as an
  // abandonment so a half-played run is never mistaken for a completed one.
  // Restarting from the results screen is not an abandonment -- that run
  // already reported itself as completed -- so it stays silent.
  function handleRestart() {
    if (settings && phase !== 'complete') {
      captureRunAbandoned({
        fromScreen: phase,
        questionsAnsweredCount: answeredCountRef.current,
        durationMs: Math.round(performance.now() - runStartRef.current),
      });
    }
    setPhase('setup');
  }

  // "Start Study Mode" off the results screen: same game, study settings,
  // keeping whatever language/cards/sound the player already chose. Save the
  // simulation answers so we can tag them in study mode.
  function handleStartStudy() {
    const simulationAnswerCount = Object.keys(answers).length;
    setSimulationAnswers(answers);
    handleStart(
      {
        language: settings?.language ?? 'english',
        mode: 'study',
        cards: settings?.cards ?? SCENARIOS.length,
        sound: settings?.sound !== false,
      },
      { isStudyFollowUp: true, simulationAnswerCount }
    );
  }

  // The two flows run the same number of screens -- Study Mode trades the
  // rules and goal screens for its own two -- so the numbering in the title
  // bars matches all the way through.
  const isStudy = settings?.mode === 'study';

  let screen;
  if (phase === 'setup') {
    screen = <SetupScreen onStart={handleStart} initial={settings} />;
  } else if (phase === 'rules') {
    screen = <RulesScreen onBack={() => setPhase('setup')} onNext={() => setPhase('goals')} />;
  } else if (phase === 'goals') {
    screen = <GoalsScreen onBack={() => setPhase('rules')} onNext={() => setPhase('consent')} />;
  } else if (phase === 'studyIntro') {
    screen = (
      <StudyIntroScreen onBack={() => setPhase('setup')} onNext={() => setPhase('studyPreview')} />
    );
  } else if (phase === 'studyPreview') {
    screen = (
      <StudyPreviewScreen
        onBack={() => setPhase('studyIntro')}
        onNext={() => setPhase('consent')}
      />
    );
  } else if (phase === 'consent') {
    screen = (
      <ConsentScreen
        study={isStudy}
        onBack={() => setPhase(isStudy ? 'studyPreview' : 'goals')}
        onNext={() => setPhase('reflect')}
      />
    );
  } else if (phase === 'reflect') {
    screen = (
      <ReflectionScreen
        label="S.04. GOALS"
        study={isStudy}
        answer={reflectionWords}
        onSaveAnswer={setReflectionWords}
        onStart={() => {
          // Study Mode never shows the words, so there is nothing to report.
          if (!isStudy) captureGoalWordsSubmitted({ words: reflectionWords });
          setPhase('transition');
        }}
        onReview={() => setPhase(isStudy ? 'studyIntro' : 'rules')}
      />
    );
  } else if (phase === 'transition') {
    screen = <PromptTransition key={index} onDone={() => setPhase('prompt')} />;
  } else if (phase === 'complete') {
    screen = (
      <CompleteScreen
        gaugeAngle={scoreToAngle(totalScore)}
        needleColor={NEEDLE_COLOR}
        totalScore={totalScore}
        simulation={settings?.mode !== 'study'}
        answers={answers}
        onRestart={() => setPhase('setup')}
        onStartStudy={handleStartStudy}
      />
    );
  } else if (phase === 'options') {
    screen = (
      <OptionsScreen
        key={scenario.code}
        scenario={scenario}
        timed={settings?.mode !== 'study'}
        study={settings?.mode === 'study'}
        isLast={index === deck.length - 1}
        gaugeAngle={scoreToAngle(totalScore)}
        needleColor={NEEDLE_COLOR}
        sound={settings?.sound !== false}
        usedCalls={usedCalls}
        simulationAnswers={simulationAnswers}
        onUseCall={(i) => setUsedCalls((prev) => prev.map((u, j) => (j === i ? true : u)))}
        onAdvisorCall={handleAdvisorCall}
        questionNumber={questionNumber}
        onReveal={handleReveal}
        onTimeoutPenalty={handleTimeoutPenalty}
        onNext={handleNext}
      />
    );
  } else {
    screen = (
      <PromptScreen
        key={scenario.code}
        scenario={scenario}
        index={index}
        total={deck.length}
        onSelectAnswer={() => setPhase('options')}
      />
    );
  }

  return (
    <>
      {/* The desktop the terminal windows are open on. Purely decorative and
          pointer-transparent; every layer is styled in styles.css. */}
      <div className="crt-backdrop" aria-hidden="true">
        <div className="crt-grid" />
        <div className="crt-scan" />
        <div className="crt-roll" />
      </div>
      {phase !== 'setup' && (
        <div className="float-actions">
          <button type="button" className="restart-float" onClick={handleRestart}>
            Restart
          </button>
          {/* Dev builds only -- it skips the whole game, so it must never
              reach players. Study Mode's results screen shows every ending at
              once, so the band picker has nothing left to pick and the button
              goes straight there. Simulation Mode still chooses where the
              needle lands. */}
          {DEV_MODE &&
            (settings?.mode === 'study' ? (
            <button
              type="button"
              className="restart-float"
              onClick={() => handleSkipToResults(null)}
            >
              Go to Results Screen
            </button>
          ) : (
            <div className="results-jump" ref={bandsRef}>
              <button
                type="button"
                className="restart-float"
                aria-expanded={bandsOpen}
                aria-haspopup="menu"
                onClick={() => setBandsOpen((open) => !open)}
              >
                Go to Results Screen
              </button>
              {bandsOpen && (
                <div className="results-jump-menu" role="menu">
                  {RESULT_BANDS.map((band) => (
                    <button
                      key={band.name}
                      type="button"
                      role="menuitem"
                      className="results-jump-item"
                      onClick={() => handleSkipToResults(band)}
                    >
                      <i style={{ background: band.color }} />
                      {band.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            ))}
        </div>
      )}
      {screen}
    </>
  );
}
