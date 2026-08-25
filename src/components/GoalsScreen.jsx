import { InfoScreen } from './InfoScreen.jsx';

const GOALS_PARAGRAPHS = [
  'The simulation is based on a series of Environmental Justice in Technology principles that will be revealed to you once you complete all the scenarios. You may or may not agree with them, and so we ask you to keep a critical perspective on this matter as well.',
  'Your goal is simple, you will be asked to selected one of five options that is most aligned with what you believe to be Environmental Justice in Technology.',
  'Simple like that.',
];

// Simulation Mode only. Study Mode arrives having already played the
// simulation, so it shows StudyPreviewScreen in this slot instead.
export function GoalsScreen({ onBack, onNext }) {
  return (
    <InfoScreen
      label="S.02. YOUR GOAL"
      heading={['YOUR', 'GOAL']}
      paragraphs={GOALS_PARAGRAPHS}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
