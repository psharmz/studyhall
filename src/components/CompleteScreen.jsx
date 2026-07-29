import { Gauge } from './Gauge.jsx';
import { WheelHamster } from '../pixels.jsx';

export function CompleteScreen({ gaugeAngle, needleColor, onRestart }) {
  return (
    <div className="screen-complete">
      <div className="card card--options card--standalone results-card">
        <div className="body">
          <h1 className="pixel">STUDY HALL COMPLETE</h1>
          <div className="results-visuals">
            <div className="gauge-wrap gauge-wrap--results">
              <Gauge angle={gaugeAngle} needleColor={needleColor} showScale />
            </div>
            <div className="rat-race rat-race--show">
              <div className="rat-wheel">
                <WheelHamster />
              </div>
            </div>
          </div>
          <div className="results-actions">
            <button type="button" className="restart-btn restart-btn--big" onClick={onRestart}>
              Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
