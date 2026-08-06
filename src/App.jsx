import { useState } from 'react';
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
  // The player's own definition of Environmental Justice in Technology
  const [reflection, setReflection] = useState('');
  const [settings, setSettings] = useState(null); // { language, mode, cards }
  const [index, setIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  // Three advisor calls per game, spendable on any card
  const [usedCalls, setUsedCalls] = useState([false, false, false]);

  // Only 5 scenarios exist so far; picking 10 or 20 cards plays all of them.
  const deck = settings ? SCENARIOS.slice(0, settings.cards) : SCENARIOS;
  const scenario = deck[Math.min(index, deck.length - 1)];

  function handleStart(chosen) {
    setSettings(chosen);
    setIndex(0);
    setTotalScore(0);
    setUsedCalls([false, false, false]);
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
  }

  // Out of time with nothing picked -- no answer to score, just the penalty.
  function handleTimeoutPenalty() {
    setTotalScore((t) => t - TIMEOUT_PENALTY);
  }

  function handleNext() {
    advance();
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
        answer={reflection}
        onSaveAnswer={setReflection}
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
        onRestart={() => setPhase('setup')}
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
      {phase !== 'setup' && (
        <button type="button" className="restart-float" onClick={() => setPhase('setup')}>
          Restart
        </button>
      )}
      {screen}
    </>
  );
}
