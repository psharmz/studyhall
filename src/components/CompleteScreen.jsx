import { useState } from 'react';
import {
  captureResultsShared,
  captureScoreBreakdownViewed,
  captureSharePreviewOpened,
} from '../telemetry.js';
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
import { EndingArt } from './EndingArt.jsx';
import { ENDING_ALIGN, ENDING_CAPTIONS, endingFor } from '../endings.js';
import { ShareSheet } from './ShareSheet.jsx';
import { ALIGN_LABELS, FACILITATOR_FORM_URL, SUPPORT_URL } from '../scenarios.js';

export function CompleteScreen({
  gaugeAngle,
  needleColor,
  totalScore,
  scoreMax,
  vision,
  simulation,
  answers,
  onRestart,
  onStartStudy,
}) {
  // Which of the four endings the needle earned. One derivation, shared with
  // the share preview so the two can never disagree.
  const ending = endingFor(gaugeAngle);
  const band = { align: ENDING_ALIGN[ending], label: ALIGN_LABELS[ENDING_ALIGN[ending]] };
  // Real play only ever sums integers; the debug band jump parks the needle on
  // a fraction, so round before it is shown or shared.
  const shownScore = Math.round(totalScore);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // The breakdown opens underneath the button rather than sitting further
  // down the page. Only the open is reported -- closing it again is not a
  // second viewing.
  function toggleBreakdown() {
    setBreakdownOpen((open) => {
      if (!open) captureScoreBreakdownViewed();
      return !open;
    });
  }

  // Share opens a preview rather than firing straight into a share sheet:
  // the result is the thing being sent, so it is worth seeing first. Opening
  // is reported separately from sending, so the two can be compared.
  function openShare() {
    captureSharePreviewOpened({ ending });
    setShareOpen(true);
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
              {/* A real anchor rather than window.open: a popup blocker can
                  swallow window.open silently, leaving the card looking dead. */}
              <a
                className="study-offer"
                href={FACILITATOR_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PixelClassroom className="study-offer-art" />
                <span className="study-offer-label">Become a Facilitator</span>
              </a>
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
                  {/* One fixed-height stage for all four endings. Their art is
                      different sizes, so without it the chip and caption below
                      sat at a different height on every result. */}
                  <div className="results-art">
                    <EndingArt ending={ending} />
                  </div>
                  <div className="results-score">
                    <div className="chip" data-align={band.align}>
                      {band.label}{' '}
                      <b className="chip-score">{shownScore}</b>
                    </div>
                  </div>
                  <div className="rat-caption">{ENDING_CAPTIONS[ending]}</div>
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
                  <button type="button" className="btn" onClick={openShare}>
                    Share
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
          {/* What they wrote on the closing card, shown in both modes. Kept
              out of the simulation-only block on purpose: a Study Mode run
              started in the same session opens on the same vision. Absent when
              nothing was written -- the card is optional. */}
          {vision?.trim() && (
            <section className="vision-recap">
              <h2 className="vision-recap-title">Your vision for the future</h2>
              <blockquote className="vision-recap-text">{vision}</blockquote>
            </section>
          )}

          {breakdownOpen && <ScoreBreakdown answers={answers} />}

          {shareOpen && (
            <ShareSheet
              ending={ending}
              score={shownScore}
              max={scoreMax}
              onClose={() => setShareOpen(false)}
              onShared={(method) => captureResultsShared({ method })}
            />
          )}

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
