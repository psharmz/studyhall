import { InfoScreen } from './InfoScreen.jsx';

// Study Mode opens here. Players arrive having already played the simulation,
// so it skips the how-to-play rules entirely and sets out what the untimed
// pass adds instead. The list stays inside the second window, under the
// sentence whose colon introduces it.
const STUDY_INTRO_WINDOWS = [
  {
    window: 'Why you are here',
    lines: [
      'If you are here, it means you already had a first experience with the simulation mode and you were able to reflect a little about Environmental Justice in Technology.',
    ],
  },
  {
    window: 'No time pressure',
    lines: [
      'In this mode you will have no time pressure, leaving you with the opportunity to contemplate and further reflect on the scenarios you encountered in the simulation mode. More specifically, here you will be able to:',
      '• See the EJIT Principle is aligned to each answer.',
      '• See how each answer aligns to the principle.',
      '• See the suggestions and biases of all advisors for each scenario.',
      '• See a reasoning behind the answer alignment.',
      '• Access additional learning resources associated to each scenario.',
      '• Provide feedback to us on corrections or ideas for improvement of each scenario.',
    ],
  },
];

export function StudyIntroScreen({ onBack, onNext }) {
  return (
    <InfoScreen
      label="S.01. WELCOME TO STUDY MODE"
      heading={['WELCOME TO', 'STUDY MODE']}
      paragraphs={STUDY_INTRO_WINDOWS}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
