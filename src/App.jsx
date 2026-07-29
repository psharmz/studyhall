import { useState } from 'react';
import { SCENARIOS, SCORE_MIN, SCORE_MAX } from './scenarios.js';
import { SetupScreen } from './components/SetupScreen.jsx';
import { PromptScreen } from './components/PromptScreen.jsx';
import { OptionsScreen } from './components/OptionsScreen.jsx';
import { CompleteScreen } from './components/CompleteScreen.jsx';

// The needle reads blue on every gauge, whatever the answer's alignment --
// the arc's own bands carry the good/bad signal.
const NEEDLE_COLOR = 'var(--blue)';

// Needle sweeps +75deg (pointing right, into the red zone) at SCORE_MIN
// down to -75deg (pointing left, into the green zone) at SCORE_MAX.
const NEEDLE_SWEEP = 75;

function scoreToAngle(score) {
  const fraction = (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
  return NEEDLE_SWEEP - fraction * (NEEDLE_SWEEP * 2);
}

export default function App() {
  const [phase, setPhase] = useState('setup'); // setup | prompt | options | complete
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
    setPhase('prompt');
  }

  function advance() {
    if (index < deck.length - 1) {
      setIndex(index + 1);
      setPhase('prompt');
    } else {
      setPhase('complete');
    }
  }

  // Out of time: score whatever was selected (if anything) and move on
  function handleSubmit(option) {
    if (option) setTotalScore(totalScore + option.score);
    advance();
  }

  // Scoring happens at reveal so the needle can swing while the answer is
  // still on screen; advancing is a separate, later step.
  function handleReveal(option) {
    setTotalScore(totalScore + option.score);
  }

  function handleNext() {
    advance();
  }

  let screen;
  if (phase === 'setup') {
    screen = <SetupScreen onStart={handleStart} />;
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
        onSubmit={handleSubmit}
        onReveal={handleReveal}
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
