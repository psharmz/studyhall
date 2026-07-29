import { useState } from 'react';
import { SCENARIOS, SCORE_MIN, SCORE_MAX } from './scenarios.js';
import { SetupScreen } from './components/SetupScreen.jsx';
import { PromptScreen } from './components/PromptScreen.jsx';
import { OptionsScreen } from './components/OptionsScreen.jsx';
import { CompleteScreen } from './components/CompleteScreen.jsx';

const ALIGN_COLORS = { full: 'var(--green)', partial: 'var(--blue)', non: 'var(--red)' };
const DEFAULT_NEEDLE = '#1A1A2E';

// Needle sweeps +75deg (pointing right, into the red zone) at SCORE_MIN
// down to -75deg (pointing left, into the green zone) at SCORE_MAX.
const NEEDLE_SWEEP = 75;

function scoreToAngle(score) {
  const fraction = (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
  return NEEDLE_SWEEP - fraction * (NEEDLE_SWEEP * 2);
}

// Matches the arc's own band colors, used on the results screen where no
// single answer's alignment applies.
function scoreToZoneColor(score) {
  const arcAngle = 90 - scoreToAngle(score);
  if (arcAngle >= 132) return '#3f9142';
  if (arcAngle >= 96) return '#f2c94c';
  if (arcAngle >= 46) return '#ef8b2c';
  return '#e0453f';
}

export default function App() {
  const [phase, setPhase] = useState('setup'); // setup | prompt | options | complete
  const [settings, setSettings] = useState(null); // { language, mode, cards }
  const [index, setIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [needleColor, setNeedleColor] = useState(DEFAULT_NEEDLE);
  // Three advisor calls per game, spendable on any card
  const [usedCalls, setUsedCalls] = useState([false, false, false]);

  // Only 5 scenarios exist so far; picking 10 or 20 cards plays all of them.
  const deck = settings ? SCENARIOS.slice(0, settings.cards) : SCENARIOS;
  const scenario = deck[Math.min(index, deck.length - 1)];

  function handleStart(chosen) {
    setSettings(chosen);
    setIndex(0);
    setTotalScore(0);
    setNeedleColor(DEFAULT_NEEDLE);
    setUsedCalls([false, false, false]);
    setPhase('prompt');
  }

  function advance(score) {
    if (index < deck.length - 1) {
      setIndex(index + 1);
      setPhase('prompt');
    } else {
      setNeedleColor(scoreToZoneColor(score));
      setPhase('complete');
    }
  }

  // Simulation Mode: score and advance in one step
  function handleSubmit(option) {
    let score = totalScore;
    if (option) {
      score += option.score;
      setTotalScore(score);
      setNeedleColor(ALIGN_COLORS[option.align]);
    }
    advance(score);
  }

  // Study Mode: scoring happens at reveal, advancing on "Next Question"
  function handleReveal(option) {
    setTotalScore(totalScore + option.score);
    setNeedleColor(ALIGN_COLORS[option.align]);
  }

  function handleNext() {
    advance(totalScore);
  }

  let screen;
  if (phase === 'setup') {
    screen = <SetupScreen onStart={handleStart} />;
  } else if (phase === 'complete') {
    screen = (
      <CompleteScreen
        gaugeAngle={scoreToAngle(totalScore)}
        needleColor={needleColor}
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
        needleColor={needleColor}
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
