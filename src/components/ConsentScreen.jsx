import { InfoScreen } from './InfoScreen.jsx';
import { PixelClock, PixelCursor, PixelForm, PixelGlobe, PixelLock } from '../pixels.jsx';

const CONSENT_PARAGRAPHS = [
  'During this experience, we collect the following data with the goal of providing you with the results of the simulation and of making this and future EJIT learning experiences better:',
  '• Country (to display local definitions of EJIT)',
  '• Answers to each question (for scoring)',
  '• Features used during the game (i.e., advisors\' call)',
  '• Time spent reading each scenario (to improve accessibility and readability)',
  '• Time to answer each question (to improve readability and difficulty)',
  '• Additional telemetry on clicks and devices used (to improve overall design and accessibility to more than one type of device and OS).',
  'We DO NOT collect and/or store:',
  '• Any personal or contact information (e.g., email, specific address beyond country)',
];

// Study Mode is untimed and scoreless, so what is collected differs: feedback
// and dwell time matter here, per-question scoring does not.
// Each collected item is a cell with its own pixel icon rather than a bullet.
const STUDY_CONSENT_PARAGRAPHS = [
  'During this part of the experience, we collect the following data with the goal of making this and future EJIT learning experiences better:',
  { icon: PixelGlobe, text: 'Country (to cross with provided suggestions)' },
  { icon: PixelForm, text: 'Suggestions on each scenario (ie. disagree section)' },
  {
    icon: PixelClock,
    text: 'Total time spent in each scenario (to explore complexity and difficulty in each scenario)',
  },
  {
    icon: PixelCursor,
    text: 'Additional telemetry on clicks in buttons during and at the end of the game (e.g., learn beyond button, download of facilitators’ guide and cards, apply to facilitators’ program, etc).',
  },
  'We DO NOT collect and/or store:',
  {
    icon: PixelLock,
    text: 'Any personal or contact information (e.g., email, specific address beyond country)',
  },
];

export function ConsentScreen({ study = false, onBack, onNext }) {
  return (
    <InfoScreen
      label="S.03. CONSENT & TRANSPARENCY"
      heading={['CONSENT &', 'TRANSPARENCY']}
      paragraphs={study ? STUDY_CONSENT_PARAGRAPHS : CONSENT_PARAGRAPHS}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
