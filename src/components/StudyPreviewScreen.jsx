import { InfoScreen } from './InfoScreen.jsx';
import { PixelCardsGuide } from '../pixels.jsx';

// Second beat of the Study Mode intro: what waits at the end of the pass.
const PREVIEW_PARAGRAPHS = [
  'Finally, after you are done you will be able to download the cards and a facilitators guide, as well as apply to be part of our Study Hall Facilitators’ Program!',
  'We wish you a great learning experience!',
];

export function StudyPreviewScreen({ onBack, onNext }) {
  return (
    <InfoScreen
      label="S.02. A FINAL GIFT"
      heading={['A FINAL', 'GIFT']}
      paragraphs={PREVIEW_PARAGRAPHS}
      art={<PixelCardsGuide className="final-gift-cards" />}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
