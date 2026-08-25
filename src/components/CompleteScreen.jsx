import { useEffect, useRef, useState } from 'react';
import { captureResultsShared, captureScoreBreakdownViewed } from '../telemetry.js';
import { Gauge } from './Gauge.jsx';
import {
  MiniHamster,
  PixelCardsGuide,
  PixelClassroom,
  PixelMoney,
  PixelReload,
  SippingHamster,
  SodaCup,
  ThoughtBubble,
  WheelHamster,
} from '../pixels.jsx';
import { ResultsCharts, ScoreBreakdown } from './ResultsCharts.jsx';
import { ALIGN_LABELS, SUPPORT_URL } from '../scenarios.js';

export function CompleteScreen({
  gaugeAngle,
  needleColor,
  totalScore,
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
  // Which quarter of the dial the needle landed in, as a chip. The dial has
  // four bands but only three real categories -- the middle two are both
  // partially aligned -- so the chip follows the category, not the band.
  const band = aligned
    ? { align: 'full', label: ALIGN_LABELS.full }
    : partial || sipping
      ? { align: 'partial', label: ALIGN_LABELS.partial }
      : { align: 'non', label: ALIGN_LABELS.non };
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [shareLabel, setShareLabel] = useState('Share');
  const shareTimer = useRef(null);

  useEffect(() => () => clearTimeout(shareTimer.current), []);

  // The breakdown opens underneath the button rather than sitting further
  // down the page. Only the open is reported -- closing it again is not a
  // second viewing.
  function toggleBreakdown() {
    setBreakdownOpen((open) => {
      if (!open) captureScoreBreakdownViewed();
      return !open;
    });
  }

  // Native share sheet where there is one; otherwise copy the link and say
  // so on the button itself. A dismissed sheet or a blocked clipboard is a
  // non-event, so nothing is reported.
  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Study Hall', url });
        captureResultsShared({ method: 'native_share' });
        return;
      }
      await navigator.clipboard.writeText(url);
      captureResultsShared({ method: 'clipboard' });
      setShareLabel('Link copied');
      shareTimer.current = setTimeout(() => setShareLabel('Share'), 2000);
    } catch {
      /* dismissed or denied -- leave the button as it was */
    }
  }

  return (
    <div className={'screen-complete' + (simulation ? ' screen-complete--sim' : '')}>
      <div className="card card--options card--standalone results-card">
        <div className="body">
          <h1 className="pixel">STUDY HALL COMPLETE</h1>
          {/* What Study Mode leads to, above the endings rather than under
              them: each is a card carrying its own picture. */}
          {!simulation && (
            <div className="study-offers">
              <button type="button" className="study-offer">
                <PixelCardsGuide className="study-offer-art" />
                <span className="study-offer-label">Cards &amp; Guide</span>
              </button>
              <button type="button" className="study-offer">
                <PixelClassroom className="study-offer-art" />
                <span className="study-offer-label">Become a Facilitator</span>
              </button>
            </div>
          )}
          <div className="results-visuals">
            <div className="results-scene">
              {/* Study Mode has no single ending to land on -- it shows the
                  whole arc at once, worst to best, so the four are read side
                  by side. Simulation Mode still lands on the one the needle
                  earned. */}
              {simulation ? (
                <>
                  {aligned && (
                    <div className="hamster-showcase-box">
                      <MiniHamster className="mini-hamster-big" />
                      <MiniHamster className="mini-hamster-big mini-hamster-big--2" />
                      <MiniHamster className="mini-hamster-big mini-hamster-big--3" />
                    </div>
                  )}
                  {/* Partially aligned: off the wheel and stopped, but only
                      just -- one hamster stands beside it, thinking it over. */}
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
                  {/* Third band: out of the wheel, but sat down with a drink
                      and sunglasses on while it drains. */}
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
                  <div className="results-score">
                    <div className="chip" data-align={band.align}>
                      {band.label}{' '}
                      {/* Real play only ever sums integers; the debug band
                          jump parks the needle on a fraction, so round. */}
                      <b className="chip-score">{Math.round(totalScore)}</b>
                    </div>
                  </div>
                  <div className="rat-caption">
                    {aligned &&
                      'Your freedom is a direct result of just and inclusive relationships with others'}
                    {partial && "Good job, you're starting to come out of it. Keep going"}
                    {sipping && 'Looks like you are drinking the cool aide'}
                    {!aligned && !partial && !sipping && 'You are trapped in the capitalism rat race'}
                  </div>
                </>
              ) : (
                <div className="ending-strip">
                  <figure className="ending-strip-item">
                    <div className="ending-strip-art">
                      <div className="rat-wheel">
                        <WheelHamster />
                      </div>
                    </div>
                    <figcaption>You are trapped in the capitalism rat race</figcaption>
                  </figure>
                  <figure className="ending-strip-item">
                    <div className="ending-strip-art">
                      <div className="hamster-showcase-box hamster-showcase-box--sip">
                        <SippingHamster className="sip-hamster" />
                        <SodaCup className="drink-cup" />
                      </div>
                    </div>
                    <figcaption>Looks like you are drinking the cool aide</figcaption>
                  </figure>
                  <figure className="ending-strip-item">
                    <div className="ending-strip-art">
                      <div className="hamster-showcase-box hamster-showcase-box--pause">
                        <div className="rat-wheel rat-wheel--still">
                          <WheelHamster />
                        </div>
                        <div className="thought-hamster">
                          <ThoughtBubble className="thought-bubble" aria-hidden="true" />
                          <MiniHamster className="mini-hamster-big" />
                        </div>
                      </div>
                    </div>
                    <figcaption>You&apos;re starting to come out of it. Keep going</figcaption>
                  </figure>
                  <figure className="ending-strip-item">
                    <div className="ending-strip-art">
                      <div className="hamster-showcase-box">
                        <MiniHamster className="mini-hamster-big" />
                        <MiniHamster className="mini-hamster-big mini-hamster-big--2" />
                        <MiniHamster className="mini-hamster-big mini-hamster-big--3" />
                      </div>
                    </div>
                    <figcaption>
                      Your freedom is a direct result of just and inclusive relationships with
                      others
                    </figcaption>
                  </figure>
                </div>
              )}

              {/* Share and the dial are Simulation Mode's ending furniture.
                  Study Mode ends on the scene alone. */}
              {simulation && (
                <div className="scene-actions">
                  <button type="button" className="btn" onClick={handleShare}>
                    {shareLabel}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={toggleBreakdown}
                    aria-expanded={breakdownOpen}
                    aria-controls="score-breakdown"
                  >
                    {breakdownOpen ? 'Hide Scoring Details' : 'See Scoring Details'}
                  </button>
                </div>
              )}

              {/* The dial is a footnote-sized icon in the scene's corner --
                  no scale labels, no hamsters, just the needle's reading. */}
              {simulation && (
                <div className="gauge-wrap gauge-wrap--results gauge-pin">
                  <Gauge angle={gaugeAngle} needleColor={needleColor} />
                </div>
              )}
            </div>

            {/* Sits alongside the scene, sharing its blue, so the route into
                Study Mode reads as part of the ending rather than a footnote.
                Study Mode has its own end actions, so it only shows here. */}
            {simulation && (
              <aside className="facilitator-panel">
                <p className="facilitator-lead">Interested in becoming a facilitator?</p>
                <p className="facilitator-step">
                  <span>First step:</span> complete the game in Study Mode.
                </p>
                <button type="button" className="btn facilitator-cta" onClick={onStartStudy}>
                  Start Study Mode
                </button>
              </aside>
            )}
          </div>

          {/* Below the row rather than inside the scene: in there it stretched
              the facilitator panel beside it to match its height, and was
              capped at the scene's column width. */}
          {breakdownOpen && <ScoreBreakdown answers={answers} />}

          {/* Restarting and supporting both step back into the corner as a
              stacked pair of square tiles, clear of the ending art. */}
          <div className="corner-actions">
            <button type="button" className="corner-btn" onClick={onRestart}>
              <PixelReload className="corner-btn-icon" />
              <span>Play Again</span>
            </button>
            {SUPPORT_URL ? (
              <a
                className="corner-btn"
                href={SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PixelMoney className="corner-btn-icon" />
                <span>Support</span>
              </a>
            ) : (
              <button type="button" className="corner-btn">
                <PixelMoney className="corner-btn-icon" />
                <span>Support</span>
              </button>
            )}
          </div>

          {simulation && <ResultsCharts answers={answers} />}
        </div>
      </div>
    </div>
  );
}
