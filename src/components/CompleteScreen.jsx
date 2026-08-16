import { useEffect, useRef, useState } from 'react';
import { Gauge } from './Gauge.jsx';
import {
  MiniHamster,
  PixelReload,
  SippingHamster,
  SodaCup,
  ThoughtBubble,
  WheelHamster,
} from '../pixels.jsx';
import { ResultsCharts } from './ResultsCharts.jsx';
import { SUPPORT_URL } from '../scenarios.js';

export function CompleteScreen({
  gaugeAngle,
  needleColor,
  simulation,
  answers,
  onRestart,
  onStartStudy,
}) {
  // The dial sweeps -75deg (fully aligned) to +75deg (non-aligned) in four
  // equal bands; the ending art follows whichever one the needle lands in.
  const aligned = gaugeAngle <= -37.5;
  const partial = gaugeAngle > -37.5 && gaugeAngle <= 0;
  const sipping = gaugeAngle > 0 && gaugeAngle <= 37.5;
  const [shareLabel, setShareLabel] = useState('Share');
  const shareTimer = useRef(null);

  useEffect(() => () => clearTimeout(shareTimer.current), []);

  // The breakdown is rendered further down by ResultsCharts; the button just
  // takes the player there.
  function scrollToBreakdown() {
    document.getElementById('score-breakdown')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

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
            <div className="results-scene">
              {aligned && (
                <div className="hamster-showcase-box">
                  <MiniHamster className="mini-hamster-big" />
                  <MiniHamster className="mini-hamster-big mini-hamster-big--2" />
                  <MiniHamster className="mini-hamster-big mini-hamster-big--3" />
                </div>
              )}
              {/* Partially aligned: off the wheel and stopped, but only just
                  -- one hamster stands beside it, thinking it over. */}
              {partial && (
                <div className="hamster-showcase-box hamster-showcase-box--pause">
                  <div className="rat-wheel rat-wheel--still">
                    <WheelHamster />
                  </div>
                  <div className="thought-hamster">
                    <ThoughtBubble className="thought-bubble" aria-hidden="true" />
                    <MiniHamster className="mini-hamster-big" />
                  </div>
                </div>
              )}
              {/* Third band: out of the wheel, but sat down with a drink and
                  sunglasses on while it drains. */}
              {sipping && (
                <div className="hamster-showcase-box hamster-showcase-box--sip">
                  <SippingHamster className="sip-hamster" />
                  <SodaCup className="drink-cup" />
                </div>
              )}
              {!aligned && !partial && !sipping && (
                <div className="rat-wheel">
                  <WheelHamster />
                </div>
              )}
              <div className="rat-caption">
                {aligned && 'You have escaped and found your comrades'}
                {partial && "Good job, you're starting to come out of it. Keep going"}
                {sipping && 'Looks like you are drinking the cool aide'}
                {!aligned && !partial && !sipping && 'You are trapped in the capitalism rat race'}
              </div>

              <div className="scene-actions">
                <button type="button" className="btn" onClick={handleShare}>
                  {shareLabel}
                </button>
                {simulation && (
                  <button type="button" className="btn" onClick={scrollToBreakdown}>
                    Scoring Details
                  </button>
                )}
              </div>

              {/* The dial is a footnote-sized icon in the scene's corner --
                  no scale labels, no hamsters, just the needle's reading. */}
              <div className="gauge-wrap gauge-wrap--results gauge-pin">
                <Gauge angle={gaugeAngle} needleColor={needleColor} />
              </div>
            </div>
          </div>

          {/* Play Again steps back into the corner: sharing, supporting and
              facilitating are the actions worth taking from here. */}
          <button type="button" className="play-again-btn" onClick={onRestart}>
            <PixelReload className="play-again-icon" />
            <span>Play Again</span>
          </button>

          <div className="results-columns">
            <div className="results-col">
              {SUPPORT_URL ? (
                <a className="btn" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
                  Support Study Hall
                </a>
              ) : (
                <button type="button" className="btn">
                  Support Study Hall
                </button>
              )}
              <p className="facilitator-lead">Interested in becoming a facilitator?</p>
              <p className="facilitator-step">
                <span>First step:</span> complete the game in Study Mode.
              </p>
              <button type="button" className="btn btn--secondary" onClick={onStartStudy}>
                Start Study Mode
              </button>
            </div>
          </div>
          {simulation && <ResultsCharts answers={answers} />}
        </div>
      </div>
    </div>
  );
}
