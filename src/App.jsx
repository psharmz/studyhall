import { useEffect, useRef, useState } from 'react';
import { SCENARIOS, SCORE_MIN, SCORE_MAX } from './scenarios.js';
import { SetupScreen } from './components/SetupScreen.jsx';
import { RulesScreen } from './components/RulesScreen.jsx';
import { GoalsScreen } from './components/GoalsScreen.jsx';
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

function scoreToAngle(score) {
  // Clamped: repeated timeouts can push the total past SCORE_MIN, and the
  // needle should stop at the end of the dial rather than swing off it.
  const raw = (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
  const fraction = Math.min(1, Math.max(0, raw));
  return NEEDLE_SWEEP - fraction * (NEEDLE_SWEEP * 2);
}

export default function App() {
  // setup | rules | goals | reflect | transition | prompt | options | complete
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
  // Band picker under the results shortcut.
  const [bandsOpen, setBandsOpen] = useState(false);
  const bandsRef = useRef(null);

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

  function handleStart(chosen) {
    setSettings(chosen);
    setIndex(0);
    setTotalScore(0);
    setUsedCalls([false, false, false]);
    setAnswers({});
    setPhase('rules');
  }

  function advance() {
    if (index < deck.length - 1) {
      setIndex(index + 1);
      setPhase('transition');
    } else {
      setPhase('complete');
    }
  }

  // Scoring happens at reveal so the needle can swing while the answer is
  // still on screen; advancing is a separate, later step.
  function handleReveal(option) {
    setTotalScore((t) => t + option.score);
    setAnswers((a) => ({ ...a, [scenario.code]: option }));
  }

  // Out of time with nothing picked -- no answer to score, just the penalty.
  function handleTimeoutPenalty() {
    setTotalScore((t) => t - TIMEOUT_PENALTY);
  }

  function handleNext() {
    advance();
  }

  // Shortcut straight to the results screen with the needle parked in the
  // chosen band, whatever has been answered so far.
  function handleSkipToResults(fraction) {
    setTotalScore(SCORE_MIN + fraction * (SCORE_MAX - SCORE_MIN));
    setBandsOpen(false);
    setPhase('complete');
  }

  // "Start Study Mode" off the results screen: same game, study settings,
  // keeping whatever language/cards/sound the player already chose.
  function handleStartStudy() {
    handleStart({
      language: settings?.language ?? 'english',
      mode: 'study',
      cards: settings?.cards ?? SCENARIOS.length,
      sound: settings?.sound !== false,
    });
  }

  let screen;
  if (phase === 'setup') {
    screen = <SetupScreen onStart={handleStart} initial={settings} />;
  } else if (phase === 'rules') {
    screen = <RulesScreen onBack={() => setPhase('setup')} onNext={() => setPhase('goals')} />;
  } else if (phase === 'goals') {
    screen = <GoalsScreen onBack={() => setPhase('rules')} onNext={() => setPhase('reflect')} />;
  } else if (phase === 'reflect') {
    screen = (
      <ReflectionScreen
        answer={reflectionWords}
        onSaveAnswer={setReflectionWords}
        onStart={() => setPhase('transition')}
        onReview={() => setPhase('rules')}
      />
    );
  } else if (phase === 'transition') {
    screen = <PromptTransition key={index} onDone={() => setPhase('prompt')} />;
  } else if (phase === 'complete') {
    screen = (
      <CompleteScreen
        gaugeAngle={scoreToAngle(totalScore)}
        needleColor={NEEDLE_COLOR}
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
        onUseCall={(i) => setUsedCalls((prev) => prev.map((u, j) => (j === i ? true : u)))}
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
          <button type="button" className="restart-float" onClick={() => setPhase('setup')}>
            Restart
          </button>
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
                    onClick={() => handleSkipToResults(band.fraction)}
                  >
                    <i style={{ background: band.color }} />
                    {band.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {screen}
    </>
  );
}
