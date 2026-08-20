import { InfoScreen } from './InfoScreen.jsx';

// Second beat of the Study Mode intro: what waits at the end of the pass.
const PREVIEW_PARAGRAPHS = [
  'Finally, after you are done you will be able to download the cards and a facilitators guide, as well as apply to be part of our Study Hall Facilitators’ Program!',
  'We wish a great learning experience!',
];

export function StudyPreviewScreen({ onBack, onNext }) {
  return (
    <InfoScreen
      label="S.03. AT THE END"
      heading={['AT THE', 'END']}
      paragraphs={PREVIEW_PARAGRAPHS}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
