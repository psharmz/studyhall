import { MiniHamster, DialArc, WheelHamster } from '../pixels.jsx';

export function Gauge({ angle, needleColor, intro = false, showScale = false }) {
  return (
    <div className={'gauge-wrap' + (intro ? ' gauge-wrap--intro' : '')}>
      <div className="gauge-row">
        <div className="gauge-hamsters">
          <MiniHamster className="mini-hamster" />
          <MiniHamster className="mini-hamster mini-hamster--2" />
          <MiniHamster className="mini-hamster mini-hamster--3" />
        </div>
        <div className="dial">
          <DialArc />
          <div
            className="dial-needle"
            style={{
              transform: `translateX(-50%) rotate(${angle}deg)`,
              '--needle-color': needleColor,
            }}
          />
        </div>
        <WheelHamster className="mini-wheel" />
      </div>
      {showScale && (
        <div className="gauge-scale gauge-scale--show">
          <span>FULLY ALIGNED</span>
          <span>NON-ALIGNED</span>
        </div>
      )}
    </div>
  );
}
