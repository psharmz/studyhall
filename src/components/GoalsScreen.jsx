import { InfoScreen } from './InfoScreen.jsx';

const GOALS_PARAGRAPHS = [
  'The simulation is based on a series of Environmental Justice in Technology principles that will be revealed to you once you complete all the scenarios. You may or may not agree with them, and so we ask you to keep a critical perspective on this matter as well.',
  'Your goal is simple, you will be asked to selected one of five options that is most aligned with what you believe to be Environmental Justice in Technology.',
  'Simple like that.',
];

// Study Mode arrives here having already played the simulation, so the copy
// sets out what the untimed pass adds rather than restating the goal.
const STUDY_PARAGRAPHS = [
  'Welcome to the study mode!',
  'If you are here, it means you already had a first experience with the simulation mode and you were able to reflect a little about Environmental Justice in Technology.',
  'In this mode you will have no time pressure, leaving you with the opportunity to contemplate and further reflect on the scenarios you encountered in the simulation mode. More specifically, here you will be able to:',
  '• See the EJIT Principle is aligned to each answer.',
  '• See how each answer aligns to the principle.',
  '• See the suggestions and biases of all advisors for each scenario.',
  '• See a reasoning behind the answer alignment.',
  '• Access additional learning resources associated to each scenario.',
  '• Provide feedback to us on corrections or ideas for improvement of each scenario.',
];

export function GoalsScreen({ study = false, onBack, onNext }) {
  return (
    <InfoScreen
      label={study ? 'S.02. STUDY MODE' : 'S.02. YOUR GOAL'}
      heading={study ? ['STUDY', 'MODE'] : ['YOUR', 'GOAL']}
      paragraphs={study ? STUDY_PARAGRAPHS : GOALS_PARAGRAPHS}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
