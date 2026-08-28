import {
  MiniHamster,
  SippingHamster,
  SodaCup,
  ThoughtBubble,
  WheelHamster,
} from '../pixels.jsx';

// The pixel art for an ending. Shared by the results scene and the share
// preview, so the picture someone sees before sending is the one they earned.
export function EndingArt({ ending }) {
  if (ending === 'aligned') {
    return (
      <div className="hamster-showcase-box">
        <MiniHamster className="mini-hamster-big" />
        <MiniHamster className="mini-hamster-big mini-hamster-big--2" />
        <MiniHamster className="mini-hamster-big mini-hamster-big--3" />
      </div>
    );
  }
  // Off the wheel and stopped, but only just -- one hamster stands beside it,
  // thinking it over.
  if (ending === 'partial') {
    return (
      <div className="hamster-showcase-box hamster-showcase-box--pause">
        <div className="rat-wheel rat-wheel--still">
          <WheelHamster />
        </div>
        <div className="thought-hamster">
          <ThoughtBubble className="thought-bubble" aria-hidden="true" />
          <MiniHamster className="mini-hamster-big" />
        </div>
      </div>
    );
  }
  // Out of the wheel, but sat down with a drink and sunglasses on.
  if (ending === 'sipping') {
    return (
      <div className="hamster-showcase-box hamster-showcase-box--sip">
        <SippingHamster className="sip-hamster" />
        <SodaCup className="drink-cup" />
      </div>
    );
  }
  return (
    <div className="rat-wheel">
      <WheelHamster />
    </div>
  );
}
