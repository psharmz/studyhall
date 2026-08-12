import { useEffect, useRef, useState } from 'react';
import { Gauge } from './Gauge.jsx';
import { WheelHamster } from '../pixels.jsx';
import { ResultsCharts } from './ResultsCharts.jsx';
import { SUPPORT_URL } from '../scenarios.js';

export function CompleteScreen({ gaugeAngle, needleColor, simulation, onRestart, onStartStudy }) {
  // The facilitator box replaces its own trigger button while it is open.
  const [facilitatorOpen, setFacilitatorOpen] = useState(false);
  const [shareLabel, setShareLabel] = useState('Share');
  const shareTimer = useRef(null);

  useEffect(() => () => clearTimeout(shareTimer.current), []);

  // Native share sheet where there is one; otherwise copy the link and say
  // so on the button itself. A dismissed sheet or a blocked clipboard is a
  // non-event, so nothing is reported.
  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Study Hall', url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareLabel('Link copied');
      shareTimer.current = setTimeout(() => setShareLabel('Share'), 2000);
    } catch {
      /* dismissed or denied -- leave the button as it was */
    }
  }

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
              <div className="rat-caption">You are trapped in the capitalism rat race</div>
            </div>
          </div>
          <div className="results-actions">
            <button type="button" className="restart-btn restart-btn--big" onClick={onRestart}>
              Play Again
            </button>
          </div>
          <div className="btn-row results-links">
            <button type="button" className="btn btn--secondary" onClick={handleShare}>
              {shareLabel}
            </button>
            {SUPPORT_URL ? (
              <a
                className="btn btn--secondary"
                href={SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Support Study Hall
              </a>
            ) : (
              <button type="button" className="btn btn--secondary">
                Support Study Hall
              </button>
            )}
            {!facilitatorOpen && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setFacilitatorOpen(true)}
              >
                Become a Study Hall Facilitator
              </button>
            )}
          </div>
          {facilitatorOpen && (
            <div className="facilitator-box">
              <button
                type="button"
                className="facilitator-close"
                aria-label="Close"
                onClick={() => setFacilitatorOpen(false)}
              >
                &times;
              </button>
              <p className="facilitator-step">First step: complete the game in Study Mode.</p>
              <button type="button" className="btn btn--secondary" onClick={onStartStudy}>
                Start Study Mode
              </button>
            </div>
          )}
          {simulation && <ResultsCharts />}
        </div>
      </div>
    </div>
  );
}
