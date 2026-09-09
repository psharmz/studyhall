import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { fetchWordCloud, fetchQuadrantAverages } from '../aggregates.js';
import quadrantMap from '../../quadrants.json';
import { SCENARIOS, ALIGN_LABELS, ALIGN_POINTS } from '../scenarios.js';
import { MiniHamster, ThoughtBubble, WheelHamster } from '../pixels.jsx';
import { DEV_MODE } from '../env.js';
import { DEV_STUB_ANSWERS, DEV_STUB_AVERAGES } from '../devStub.js';

const CLOUD_ALL = 'All';

// Four themes, clockwise from the top vertex. `title` is pre-split into lines
// because SVG text does not wrap on its own. `slug` is the stable name the
// telemetry uses for this theme's column (category_<slug>_score) -- it does not
// change when the wording of a title does. Not to be confused with RADAR_SERIES'
// `key`, which names the field a series reads off each axis.
//
// Which scenarios feed each quadrant, and therefore its max, come from
// quadrants.json -- the same file the Modal aggregation reads, so the game and
// the averages it plots can never disagree about what a quadrant contains.
// Titles and suggestion copy stay here; only the map is shared.
const SCENARIOS_BY_SLUG = Object.fromEntries(
  quadrantMap.quadrants.map((q) => [q.slug, q.scenarios])
);

// What an answer is worth per card, from the same shared block the game scores
// its options with and the Modal aggregation averages by. A quadrant therefore
// runs from points.non to points.full per card, and sits at zero when answers
// are non-aligned as often as they are aligned.

const RADAR_AXES_BASE = [
  {
    slug: 'power_positionality',
    title: ['Designing with Power and Positionality in Mind'],
    suggestions: [
      {
        label: 'Learning with others',
        text: 'Look around you. What technologies do people around you use daily and which ones are not accessible to them? Who made these technologies? Do you know how they serve your community and how they serve those that built it? Whose interests are really at the center of the development and usage of these tools? Here you can also map assumptions, observations and understandings about race, colonialism, and power as they relate to the history of the people that use and build the tools.',
      },
      {
        label: 'Mapping the systems',
        text: 'Have you ever considered applying your knowledge to build a table comparing community-owned/open source and mainstream/commercial alternatives to the tech used by you and those in your community? How do they compare beyond available features and aesthetics? For example, are there power asymmetries that can further reinforce the position of those with already a lot of power? How do these asymmetries are embedded in the tech lifecycle from early development to usage, and disposal or composting? How these asymmetries are reinforced or hindered by the interaction between the different technologies in your community?',
      },
      {
        label: 'Helping others',
        text: 'Your critical perspective is valuable! Have you ever considered using your knowledge to draft a public policy proposal or design process that can support power distribution and how technical decisions can be rejected by communities in cases of disagreement? Think about how you can use that to guide all stakeholders, but specially the most vulnerable ones, to move beyond consultation and into actual decision-making power for acceptance, development, modification, and stoppage.',
      },
    ],
  },
  {
    slug: 'access_accountability',
    title: ['Embedding Access, Accountability,', 'and Reparative Practice'],
    suggestions: [
      {
        label: 'Learning with others',
        text: 'Look around you. What technologies do people around you use daily and which ones are not accessible to them? Talk to people and ask if they understand the trade offs of the technologies that are accessible to them - for example, do free tools require collection of personal information? Start a simple map with the information you gather from others and try to understand how their life story relates to how they use, understand, talk about technology.',
      },
      {
        label: 'Mapping the systems',
        text: 'Have you ever considered using the knowledge you have to a create comparative table of relevant technologies to your community? You can help moving towards a more just future with technology by comparing aspects such as documentations access, repairability, modification rights, who benefits, who might be harmed (humans and non-humans) and how harms can be handle if they happen. You can also take a step further and look at such aspects of comparison within the lifecycle of the technology to understand more about the impact of its creation (e.g., resource extraction), usage (including in its interaction with other technologies), and disposal.',
      },
      {
        label: 'Helping others',
        text: 'You seem to have some strong understanding on the topic! Have you ever considered using your knowledge to draft a public policy proposal or a designing a process to measure and enable equitable accessibility, accountability (including reparation from harms), and safety (preventive and reactive)? Finally, how can you draft these documents through a participatory process with others from your community?',
      },
    ],
  },
  {
    slug: 'collective_flourishing',
    title: ['Restructuring Innovation for', 'Collective Flourishing'],
    suggestions: [
      {
        label: 'Learning with others',
        text: 'Have you taken some time to notice the examples of innovation around you? Which ones often appear in the news, workplaces, and other environments that are part of your reality and that of your community? What makes those technologies innovative? Who defines what is innovative? What types of knowledge are centered and which ones are ignored in these technologies? What is their main impact and purpose - speed, novelty, capital and wealth? Historically, have they enable collective flourishing or individual competition?',
      },
      {
        label: 'Mapping the systems',
        text: 'Have you consider using your knowledge to compare venture-capital/market-driven innovations with community-led/mutual aid innovation? What forms of legal structures are present in each? What incentives and barriers facilitate or difficult their development? Which of them has historically shown a relative higher rate of harms and unintended consequences? How do market-driven innovations interact within themselves? What about community-led innovations? Finally, how do market-driven and community-led innovations interact with each other - do they collaborate or compete? Who often loses? Why?',
      },
      {
        label: 'Helping others',
        text: 'Your critical perspective can help others! Have you ever considered using your knowledge to draft a public policy proposal or innovation process centered in collective well-being instead of speed and individual wealth accumulation? What methods and criteria can be used as indicators of shared benefit, distributed decision-making power, plurality of knowledge and participation? What criteria can be used to build a systems of incentive that reinforce this collective well-being? How can community reviews, participatory budgeting, harm prevention plan, reparation plans, and public and transparent document of harms and learnings can lead to a more just innovation process?',
      },
    ],
  },
  {
    slug: 'technology_nature',
    title: ['Reorienting the Relationship Between Technology and Nature'],
    suggestions: [
      {
        label: 'Learning with others',
        text: 'Take some time to notice the type of technology most used in your community. What materials are used in this technology? Where do these materials come from? What type of energy (e.g., hydro, coal, gas, solar, wind...) supplies these technologies and your community? How is the infrastructure that supports these technologies exploit versus care about nature? How do people in your community talk about and relate to non-human life? What practices do they have that show alignment or dealignment with the technologies used? How has technology historically influenced the changes in these practices of relationship with nature in your community?',
      },
      {
        label: 'Mapping the systems',
        text: 'Have you consider using your knowledge to compare the extractive technologies with regenerative alternatives? How do they relate and learn from nature? How do they support people\'s relationship with other forms of life and their supporting environment? What forms of energy they use? What are their ecosystem impacts, who bears the harms, and how restoration responds to the harms cause by each of them? Finally, can you map these aspects in each stage of the technology lifecycle and in their interactions with other technologies that are involved in the creation, usage, and disposal of restorative versus regenerative tech?',
      },
      {
        label: 'Helping others',
        text: 'Your knowledge can support a more just future! Consider writing a public policy draft or a design process that supports technologies that restore instead of exploit life on Earth. How should work relationship be set in such a restorative perspective? What is the value of life beyond its transformation into products and materials? What indicators of regeneration, local ecological limits, and harm should be considered? How can the participation of peoples with different forms of knowledge, such as indigenous peoples and traditional communities, be essential in such a transformation? How may historical harms be taken into account, linking technology development to restoration and reconciliation funds and actions? Embed lessons into the document to model scientific, ecological, and political humility and accountability.',
      },
    ],
  },
];

// Where a quadrant's three suggestion bands split, as inclusive upper bounds,
// from the printed scoring guide. The first band swallows the whole negative
// half and stops at +1 -- anything from rock bottom to just above zero is still
// "learning with others" -- and the positive half is split evenly between the
// other two. A 35-point quadrant therefore reads -35..+1, +2..+17, +18..+35,
// and a 20-point one -20..+1, +2..+10, +11..+20.
function bandMaxes(max) {
  return [1, Math.floor(max / 2), max];
}

export const RADAR_AXES = RADAR_AXES_BASE.map((axis) => {
  const scenarios = SCENARIOS_BY_SLUG[axis.slug];
  const max = scenarios.length * ALIGN_POINTS.full;
  // Derived from the quadrant's own ceiling rather than written per band, so a
  // quadrant gaining or losing a card cannot leave the thresholds behind.
  const cuts = bandMaxes(max);
  return {
    ...axis,
    scenarios,
    max,
    min: scenarios.length * ALIGN_POINTS.non,
    suggestions: axis.suggestions.map((band, i) => ({ ...band, max: cuts[i] })),
  };
});

// Both series are real now: the player's own totals come from their answers via
// axisScore, and the comparison series is fetched from the aggregation. Nothing
// on this chart is placeholder data any more.
export const RADAR_SCORES_ARE_PLACEHOLDER = false;
const RADAR_SERIES = [
  { key: 'you', name: 'Your score', stroke: '#A9E9E4', fill: 'rgba(124, 186, 186, 0.42)' },
  {
    key: 'avg',
    name: 'Avg. score of all participants',
    stroke: '#A97BF0',
    fill: 'rgba(139, 90, 214, 0.32)',
  },
];

// Keyed by series so a chip can be filled with exactly the colour its ring and
// its legend swatch already use.
const RADAR_SERIES_BY_KEY = Object.fromEntries(RADAR_SERIES.map((s) => [s.key, s]));

const CLOUD_W = 400;
const CLOUD_H = 300;
// A diamond, with all four quadrants named around it and their scores beneath.
// The canvas is mostly margin: the web itself is small relative to the room the
// four headers need above, below and either side of it.
const RADAR_W = 760;
const RADAR_H = 600;
const RADAR_CX = 380;
const RADAR_CY = 280;
const RADAR_R = 148;
const RADAR_RINGS = 4;
// Zero sits halfway out, so with four rings it lands exactly on the second.
const BASELINE_FRACTION = 0.5;
// The scale's two ends: non-aligned at the centre, fully aligned at the rim.
const RADAR_FLOOR_COLOR = '#E5484D';
const RADAR_CEIL_COLOR = '#7CFA6B';
const ringColor = d3.interpolateRgb(RADAR_FLOOR_COLOR, RADAR_CEIL_COLOR);
// Where a header sits relative to its vertex, and how wide it may run before
// wrapping (mono, so a character is a predictable fraction of the size).
const LABEL_GAP = 18;
const LABEL_SIZE = 15;
const LABEL_LINE = 18;
const LABEL_WRAP = 20;
// The score chips under each quadrant's name, stacked one per series. Stacking
// buys the numbers a readable size that two chips on a single line could not.
const CHIP_H = 20;
const CHIP_PAD_X = 7;
const CHIP_V_GAP = 4;
const CHIP_TOP_GAP = 7;
const CHIP_SIZE = 13;
const MONO = "'JetBrains Mono', monospace";


function WordCloud({ words, scope }) {
  const ref = useRef(null);
  const wrapRef = useRef(null);
  // Which word the cursor is over, and where to put the readout. Kept in state
  // rather than drawn by d3 so the layout is not recomputed on every hover --
  // d3-cloud's placement is expensive and would reshuffle the whole cloud.
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const color = d3.scaleOrdinal().range(['#7CFA6B', '#4DA8DA', '#E8E8E8', '#9A9A9A', '#4E9E45']);

    // d3-cloud lays out asynchronously off a canvas measure pass, so the
    // draw happens in its 'end' callback rather than inline.
    const layout = cloud()
      .size([CLOUD_W, CLOUD_H])
      .words(words.map((w) => ({ ...w })))
      .padding(2)
      .rotate((_, i) => (i % 3 === 0 ? 90 : 0))
      .font(MONO)
      .fontWeight(700)
      .fontSize((d) => d.size * 0.62)
      .on('end', (laidOut) => {
        svg
          .append('g')
          .attr('transform', `translate(${CLOUD_W / 2},${CLOUD_H / 2})`)
          .selectAll('text')
          .data(laidOut)
          .join('text')
          .attr('class', 'cloud-word')
          .attr('font-family', MONO)
          .attr('font-weight', 700)
          .attr('font-size', (d) => `${d.size}px`)
          .attr('fill', (d, i) => color(i))
          .attr('text-anchor', 'middle')
          .attr('transform', (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
          .text((d) => d.text)
          // Placed against the panel, not the SVG: the SVG is scaled by its
          // viewBox, so its internal coordinates are not screen pixels.
          .on('mousemove', (event, d) => {
            const box = wrapRef.current.getBoundingClientRect();
            setHover({
              text: d.text,
              count: d.count,
              x: event.clientX - box.left,
              y: event.clientY - box.top,
            });
          })
          .on('mouseleave', () => setHover(null));
      });

    layout.start();

    return () => {
      layout.stop();
      svg.selectAll('*').remove();
      setHover(null);
    };
  }, [words]);

  return (
    <div className="cloud-wrap" ref={wrapRef} onMouseLeave={() => setHover(null)}>
      <svg
        ref={ref}
        className="results-chart-svg"
        viewBox={`0 0 ${CLOUD_W} ${CLOUD_H}`}
        role="img"
        aria-label={`Word cloud of what players picked, for ${scope}`}
      />
      {hover && (
        <div
          className="cloud-tip"
          style={{ left: hover.x, top: hover.y }}
          role="status"
          aria-live="polite"
        >
          <span className="cloud-tip-word">{hover.text}</span>
          <span className="cloud-tip-count">
            {hover.count} {hover.count === 1 ? 'pick' : 'picks'}
          </span>
        </div>
      )}
    </div>
  );
}


// What the player scored on the cards feeding this quadrant. Scenario 17 sits
// in two quadrants, so its score counts towards both. Cards that were never
// dealt -- a short deck, or one not written yet -- contribute nothing.
export function axisScore(axis, answers) {
  return axis.scenarios.reduce((total, n) => {
    const answer = answers?.[`S.${String(n).padStart(2, '0')}`];
    return total + (answer?.score ?? 0);
  }, 0);
}

// Which of an axis's three bands a score falls in. Each axis carries its own
// thresholds, scaled to its own max -- a 15 is the top band on a 20-point
// quadrant but the middle band on a 30-point one.
function wrapLabel(title, maxChars) {
  const lines = [];
  let line = '';
  for (const word of title.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function suggestionFor(axis) {
  const bands = axis.suggestions;
  return bands.find((b) => axis.you <= b.max) ?? bands[bands.length - 1];
}


// How this player answered scenario `n`, as a chip alignment. The axes run to
// scenario 16 while only a handful of cards are written, so most of them have
// no answer to read -- those fall back to 'unanswered', which is styled green.
function alignFor(answers, n) {
  const code = `S.${String(n).padStart(2, '0')}`;
  return answers?.[code]?.align ?? 'unanswered';
}

const scenarioByCode = Object.fromEntries(SCENARIOS.map((sc) => [sc.code, sc]));

function scenarioFor(n) {
  return scenarioByCode[`S.${String(n).padStart(2, '0')}`] ?? null;
}

// What one scenario chip opens, in reading order: what they answered, why the
// aligned answer is the aligned one, that answer itself where they did not pick
// it, the EJIT principle behind it, and the scenario last for anyone who wants
// to reread the card. Replaces
// the suggestion block rather than sitting under it, so the card stays one
// screenful.
function ScenarioDetail({ n, answers }) {
  const scenario = scenarioFor(n);
  if (!scenario) {
    return (
      <div className="scenario-detail">
        <div className="scenario-detail-head">
          <h4 className="scenario-detail-title">Scenario {n}</h4>
        </div>
        <p className="scenario-detail-note">This card has not been written yet.</p>
      </div>
    );
  }

  const picked = answers?.[scenario.code] ?? null;
  // Some cards have more than one fully aligned answer.
  const aligned = scenario.options.filter((o) => o.align === 'full');
  // A timed-out card is scored as a non-aligned answer, so the aligned one is
  // still worth showing -- they never saw it.
  const pickedWasAligned = picked?.align === 'full';

  return (
    <div className="scenario-detail">
      <div className="scenario-detail-head">
        <h4 className="scenario-detail-title">
          Scenario {n}: {scenario.titleLines.join(' ')}
        </h4>
        {/* Signed only when there is something to sign -- "+0" reads oddly. */}
        <span className="chip" data-align={picked ? picked.align : 'unanswered'}>
          {picked && picked.score > 0 ? `+${picked.score}` : (picked?.score ?? 0)}
        </span>
      </div>

      <h5 className="scenario-detail-label">Your answer</h5>
      {picked ? (
        <p className="scenario-detail-answer" data-align={picked.align}>
          {/* Nothing was picked when the clock ran out, so there is no option
              to quote -- only what it was scored as. */}
          {picked.timedOut ? 'You ran out of time without choosing.' : picked.text}
          <span className="scenario-detail-align">{ALIGN_LABELS[picked.align]}</span>
        </p>
      ) : (
        <p className="scenario-detail-note">You did not play this scenario.</p>
      )}

      <h5 className="scenario-detail-label">Why</h5>
      {aligned.map((o) => (
        <p key={o.text} className="scenario-detail-why">
          {o.explanation}
        </p>
      ))}

      {/* Only worth showing when it is not the one they already picked. */}
      {!pickedWasAligned && aligned.length > 0 && (
        <>
          <h5 className="scenario-detail-label">Fully aligned answer</h5>
          {aligned.map((o) => (
            <p key={o.text} className="scenario-detail-answer" data-align="full">
              {o.text}
            </p>
          ))}
        </>
      )}

      {scenario.principle && (
        <>
          <h5 className="scenario-detail-label">EJIT principle</h5>
          <p className="scenario-detail-principle">{scenario.principle}</p>
        </>
      )}

      <h5 className="scenario-detail-label">The scenario</h5>
      {scenario.paragraphs.map((para) => (
        <p key={para.slice(0, 40)} className="scenario-detail-prompt">
          {para}
        </p>
      ))}
    </div>
  );
}

// Study Mode's answer to the scenario tabs. Simulation Mode shows the one
// suggestion the player's own score earned; here the whole ladder is on show
// at once, each rung labelled with the range it answers to. Nobody is being
// marked in Study Mode -- the suggestions are the material, not a verdict.
//
// The art is the game's own shorthand for the three bands, the same pieces the
// endings use: still on the wheel, off it and thinking, out and dancing.
function bandArt(i) {
  if (i === 0) {
    return (
      <div className="rat-wheel">
        <WheelHamster />
      </div>
    );
  }
  if (i === 1) {
    return (
      <div className="thought-hamster">
        <ThoughtBubble className="thought-bubble" aria-hidden="true" />
        <MiniHamster className="mini-hamster-big" />
      </div>
    );
  }
  return <MiniHamster className="mini-hamster-big" />;
}

// "+18", "-35", "0" -- signed, because the bands run either side of zero and a
// bare "18" beside a "-35" reads as a different kind of number.
function signed(n) {
  return n > 0 ? `+${n}` : `${n}`;
}

// What each band is called, and the alignment colour it borrows for its chip.
// The three read as the game's own red/yellow/green rather than as a fourth
// palette: they are the same idea the option chips carry on every card.
const BAND_NAMES = [
  { name: 'Low score', align: 'non' },
  { name: 'Medium score', align: 'partial' },
  { name: 'High score', align: 'full' },
];

function SuggestionBands({ axis }) {
  return (
    <div className="suggestion-bands">
      <h4 className="radar-detail-suggest">Suggestions for Taking Action</h4>
      {/* The three bands read across rather than down: they are one ladder, and
          side by side the ranges can be compared at a glance. */}
      <div className="suggestion-band-row">
      {axis.suggestions.map((band, i) => {
        // Each band picks up where the one below it stopped; the first starts
        // at the quadrant's floor.
        const from = i === 0 ? axis.min : axis.suggestions[i - 1].max + 1;
        return (
          <section className="suggestion-band" key={band.label}>
            <div className="suggestion-art" data-band={i} aria-hidden="true">
              {bandArt(i)}
            </div>
            <div className="suggestion-band-body">
              <h5 className="suggestion-band-label">{band.label}</h5>
              <span
                className="suggestion-band-range chip"
                data-align={BAND_NAMES[i].align}
              >
                {BAND_NAMES[i].name} {signed(from)} to {signed(band.max)}
              </span>
              <p className="suggestion-band-text">{band.text}</p>
            </div>
          </section>
        );
      })}
      </div>
    </div>
  );
}

// The web on its own -- no titles, no chips, no callout. Everything about the
// selected vertex is read off the card beside it instead, which is why the
// box is only as wide as the chart now.
function RadarChart({ answers: realAnswers, study = false }) {
  // A dev build with nothing played falls back to stub answers, so the chart,
  // the chips and the per-scenario detail can all be looked at without playing
  // nineteen cards first. Never in a production build.
  const answers =
    DEV_MODE && !Object.keys(realAnswers ?? {}).length ? DEV_STUB_ANSWERS : realAnswers;

  // Which scenario chip is open, if any. The quadrant's first card is open on
  // arrival rather than nothing, so the detail below the tabs is never an empty
  // space waiting to be discovered; clicking the open chip still closes it.
  // Picking a different quadrant opens that quadrant's first card in turn.
  const [openScenario, setOpenScenario] = useState(RADAR_AXES[0].scenarios[0]);

  // Cross-player averages, or null while loading / when unavailable. The
  // comparison series is simply not drawn in that case rather than shown
  // against invented numbers.
  const [averages, setAverages] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchQuadrantAverages().then((data) => {
      if (controller.signal.aborted) return;
      setAverages(data ?? (DEV_MODE ? DEV_STUB_AVERAGES : null));
    });
    return () => controller.abort();
  }, []);

  const ref = useRef(null);
  // The sideways-scrolling box the chart sits in on a phone; the effect below
  // centres it on open.
  const scrollRef = useRef(null);
  // Selections for the marks that change with the selection, kept so the
  // highlight effect can restyle them without redrawing the chart. Redrawing
  // on hover used to tear the vertex out from under the cursor mid-click.
  const marks = useRef({ aura: null, sel: null, dot: null, labels: null });
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);
  // Which average vertex the pointer is on, if any. Separate from `hovered`:
  // that one drives the quadrant selection, this one only shows a readout.
  const [hoveredAvg, setHoveredAvg] = useState(null);

  // The axes as drawn: static definitions, this player's own totals, and the
  // fetched average where there is one.
  const axes = useMemo(
    () =>
      RADAR_AXES.map((axis) => ({
        ...axis,
        you: axisScore(axis, answers),
        avg: averages?.[axis.slug]?.avg ?? null,
      })),
    [answers, averages]
  );

  // Drawn series: the average one only once its data is in, and in Study Mode
  // the player's own is left off altogether -- there is no score on show there,
  // so a shape drawn from one would be the only place it appeared.
  const series = useMemo(
    () =>
      RADAR_SERIES.filter(
        (s) => (s.key !== 'avg' || averages) && (s.key !== 'you' || !study)
      ),
    [averages, study]
  );

  useEffect(() => {
    const svg = d3.select(ref.current);
    // Paint sources for the web: a red bloom at the centre and a spoke fade
    // that carries the same red out to the rim's green.
    const defs = svg.append('defs');

    const core = defs
      .append('radialGradient')
      .attr('id', 'radar-core-glow');
    core.append('stop').attr('offset', '0%').attr('stop-color', RADAR_FLOOR_COLOR).attr('stop-opacity', 0.55);
    core.append('stop').attr('offset', '60%').attr('stop-color', RADAR_FLOOR_COLOR).attr('stop-opacity', 0.18);
    core.append('stop').attr('offset', '100%').attr('stop-color', RADAR_FLOOR_COLOR).attr('stop-opacity', 0);

    const spoke = defs
      .append('linearGradient')
      .attr('id', 'radar-spoke-fade')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -RADAR_R);
    spoke.append('stop').attr('offset', '0%').attr('stop-color', RADAR_FLOOR_COLOR);
    spoke.append('stop').attr('offset', String(BASELINE_FRACTION * 100) + '%').attr('stop-color', ringColor(BASELINE_FRACTION));
    spoke.append('stop').attr('offset', '100%').attr('stop-color', RADAR_CEIL_COLOR);

    const g = svg.append('g').attr('transform', `translate(${RADAR_CX},${RADAR_CY})`);

    // Quadrants hold different numbers of cards, so a spoke is plotted as a
    // fraction of its own range -- otherwise the 35-point quadrant would always
    // dwarf the 20-point ones and the shape would say nothing about how the
    // player actually did.
    //
    // The scale runs floor-to-ceiling, not zero-to-ceiling: every quadrant's
    // -5-per-card floor sits at the centre, zero lands exactly on the middle
    // ring, and the +5-per-card ceiling is the rim. A shape inside the middle
    // ring is a quadrant answered worse than not at all.
    const r = (value, i) => {
      const { min, max } = axes[i];
      const t = (value - min) / (max - min);
      return Math.min(1, Math.max(0, t)) * RADAR_R;
    };
    const angle = (i) => (i * 2 * Math.PI) / axes.length;
    const px = (radius, i) => radius * Math.sin(angle(i));
    const py = (radius, i) => -radius * Math.cos(angle(i));
    const ring = (radius) => axes.map((_, i) => `${px(radius, i)},${py(radius, i)}`).join(' ');

    // The web reads as a scale rather than plain graph paper: the centre is
    // where every answer went non-aligned, the rim is where every answer
    // landed, and the ring halfway between the two is zero. Colour carries
    // that -- red at the middle, green at the rim -- instead of white.
    //
    // A red wash at the centre and a green glow on the rim mark the two ends.
    g.append('circle')
      .attr('class', 'radar-core')
      .attr('r', RADAR_R / RADAR_RINGS)
      .attr('fill', 'url(#radar-core-glow)');

    g.selectAll('.radar-ring')
      .data(d3.range(1, RADAR_RINGS + 1).map((i) => i / RADAR_RINGS))
      .join('polygon')
      .attr('class', (fraction) =>
        fraction === 1
          ? 'radar-ring radar-ring--rim'
          : fraction === BASELINE_FRACTION
          ? 'radar-ring radar-ring--zero'
          : 'radar-ring'
      )
      .attr('points', (fraction) => ring(fraction * RADAR_R))
      .attr('fill', 'none')
      .attr('stroke', (fraction) => ringColor(fraction))
      .attr('stroke-width', (fraction) => (fraction === 1 || fraction === BASELINE_FRACTION ? 1.6 : 1))
      .attr('stroke-opacity', (fraction) =>
        fraction === 1 ? 0.95 : fraction === BASELINE_FRACTION ? 0.8 : 0.42
      );

    // Spokes fade out of the red centre into the green rim, so they read with
    // the rings rather than cutting white lines across them.
    g.selectAll('.radar-spoke')
      .data(axes)
      .join('line')
      .attr('class', 'radar-spoke')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (_, i) => px(RADAR_R, i))
      .attr('y2', (_, i) => py(RADAR_R, i))
      .attr('stroke', 'url(#radar-spoke-fade)')
      .attr('stroke-opacity', 0.5);

    const line = d3
      .lineRadial()
      .radius((d, i) => r(d, i))
      .angle((_, i) => angle(i))
      .curve(d3.curveLinearClosed);

    g.selectAll('.radar-area')
      .data(series)
      .join('path')
      .attr('class', 'radar-area')
      .attr('d', (s) => line(axes.map((a) => a[s.key])))
      .attr('fill', (s) => s.fill)
      .attr('stroke', (s) => s.stroke)
      .attr('stroke-width', 2);

    series.forEach((s) => {
      const dots = g.append('g');
      const at = (fn) => (d, i) => fn(r(d[s.key], i), i);

      // Only the "your score" vertices are selectable, so only they get the
      // breathing halo that marks them as live targets.
      if (s.key === 'you') {
        marks.current.aura = dots
          .selectAll('.radar-dot-aura')
          .data(axes)
          .join('circle')
          .attr('class', 'radar-dot-aura')
          .attr('cx', at(px))
          .attr('cy', at(py))
          .attr('r', 9)
          .attr('fill', s.stroke)
          .style('animation-delay', (_, i) => `${i * 0.45}s`);

        // The selection mark: a red disc appended before the dots so it sits
        // behind the vertex still pulsing on top of it. Only ever shown on
        // the active/hovered vertex.
        marks.current.sel = dots
          .selectAll('.radar-dot-selected')
          .data(axes)
          .join('circle')
          .attr('class', 'radar-dot-selected')
          .attr('cx', at(px))
          .attr('cy', at(py))
          .attr('r', 12)
          .attr('fill', 'var(--red)')
          .attr('display', 'none');
      }

      const dot = dots
        .selectAll('.radar-dot')
        .data(axes)
        .join('circle')
        .attr('class', s.key === 'you' ? 'radar-dot radar-dot--you' : 'radar-dot')
        .attr('cx', at(px))
        .attr('cy', at(py))
        .attr('r', 3)
        .attr('fill', s.stroke)
        .style('animation-delay', (_, i) => `${i * 0.45}s`);

      if (s.key === 'you') marks.current.dot = dot;
      if (s.key === 'avg') marks.current.avgDot = dot;

      // The average ring answers a question of its own -- "how did everyone
      // else do here?" -- so its vertices get the same generous hit target
      // the player's own do, and a readout on hover.
      if (s.key === 'avg') {
        dots
          .append('g')
          .selectAll('circle')
          .data(axes)
          .join('circle')
          .attr('class', 'radar-avg-hit')
          .attr('cx', at(px))
          .attr('cy', at(py))
          .attr('r', 16)
          .attr('fill', 'transparent')
          .style('cursor', 'pointer')
          .on('mouseenter', (_, d) => setHoveredAvg(axes.indexOf(d)))
          .on('mouseleave', () => setHoveredAvg(null));
      }
    });

    // The average readout, drawn once and moved into place on hover. Inside
    // the SVG rather than floating over it, so it needs no coordinate maths
    // and travels with the chart when it scrolls sideways on a phone.
    const tip = g.append('g').attr('class', 'radar-avg-tip').attr('display', 'none');
    tip.append('rect').attr('class', 'radar-avg-tip-box').attr('rx', 3);
    tip.append('text').attr('class', 'radar-avg-tip-text').attr('text-anchor', 'middle');
    marks.current.avgTip = tip;

    // Every quadrant is named, all the time. The selected one is simply the
    // one at full strength -- see the highlight effect.
    marks.current.labels = g
      .append('g')
      .selectAll('g')
      .data(axes)
      .join('g')
      .attr('class', 'radar-axis-label')
      .style('cursor', 'pointer')
      // The header is a second way in, alongside the dot itself.
      .on('click', (_, d) => {
        const next = axes.indexOf(d);
        setActive(next);
        setOpenScenario(axes[next].scenarios[0]);
      });

    marks.current.labels.each(function (d, i) {
      const group = d3.select(this);
      const [x, y] = [px(RADAR_R + LABEL_GAP, i), py(RADAR_R + LABEL_GAP, i)];
      const lines = wrapLabel(d.title.join(' '), LABEL_WRAP);
      // Top and bottom read centred over their point; the sides read outward.
      const anchor = i === 0 || i === 2 ? 'middle' : i === 1 ? 'start' : 'end';
      // One chip per series, stacked under the title. Study Mode drops the
      // player's own number -- it is not a graded run, and the card beside the
      // chart lists every band rather than the one a score fell in. The average
      // is absent until Modal answers, so the block can be a line shorter still.
      const chips = [
        ...(study ? [] : [{ key: 'you', label: 'YOU', text: `${d.you}/${d.max}` }]),
        ...(d.avg === null || d.avg === undefined
          ? []
          : [{ key: 'avg', label: 'AVG', text: `${d.avg}/${d.max}` }]),
      ];

      // How much room the stack needs below the last line of the title.
      const chipsH = CHIP_TOP_GAP + chips.length * CHIP_H + (chips.length - 1) * CHIP_V_GAP;
      // Title baselines, then the stack under them. The whole block hangs
      // above the top vertex, below the bottom one, and is centred on the two
      // at the sides.
      const titleH = (lines.length - 1) * LABEL_LINE;
      const firstY =
        i === 0
          ? y - chipsH - titleH
          : i === 2
            ? y + LABEL_LINE
            : y - (titleH + chipsH) / 2;

      lines.forEach((line, n) => {
        group
          .append('text')
          .attr('class', 'radar-axis-title')
          .attr('x', x)
          .attr('y', firstY + n * LABEL_LINE)
          .attr('text-anchor', anchor)
          .attr('font-size', LABEL_SIZE)
          .attr('font-weight', 700)
          .text(line);
      });

      // The scores sit under the quadrant's name rather than in the card, as
      // one chip per series carrying that series' own colour -- so a chip and
      // the ring it belongs to are obviously the same thing, and the legend
      // below the chart reads as the key to both. Stacked rather than side by
      // side: two chips on one line only fit at a size the numbers get lost at.
      const stack = group
        .append('g')
        .attr('class', 'radar-score-chips')
        .attr('transform', `translate(${x},${firstY + titleH + CHIP_TOP_GAP})`);

      chips.forEach((chip, n) => {
        const g2 = stack
          .append('g')
          .attr('class', 'radar-score-chip')
          .attr('data-series', chip.key);
        const rect = g2.append('rect').attr('rx', 2);
        const label = g2
          .append('text')
          .attr('class', 'radar-score-chip-text')
          .attr('x', CHIP_PAD_X)
          .attr('y', CHIP_H / 2)
          .attr('dominant-baseline', 'middle')
          .attr('font-size', CHIP_SIZE)
          .attr('font-weight', 700)
          .text(`${chip.label} ${chip.text}`);
        // Each chip is only as wide as its own contents, so the stack is
        // shifted per chip rather than as a block -- otherwise the shorter of
        // the two would not line up with the title above it.
        const width = label.node().getComputedTextLength() + CHIP_PAD_X * 2;
        rect.attr('x', 0).attr('y', 0).attr('width', width).attr('height', CHIP_H)
          .attr('fill', RADAR_SERIES_BY_KEY[chip.key].stroke);
        const shift = anchor === 'middle' ? -width / 2 : anchor === 'end' ? -width : 0;
        g2.attr('transform', `translate(${shift},${n * (CHIP_H + CHIP_V_GAP)})`);
      });
    });

    // Generous invisible hit targets on each vertex drive the detail card. They
    // ride whichever shape is actually drawn: the player's own where there is
    // one, the average in Study Mode where there is not.
    const hitAt = (d) => (study ? (d.avg ?? d.you) : d.you);
    g.append('g')
      .selectAll('circle')
      .data(axes)
      .join('circle')
      .attr('cx', (d, i) => px(r(hitAt(d), i), i))
      .attr('cy', (d, i) => py(r(hitAt(d), i), i))
      .attr('r', 20)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mouseenter', (_, d) => setHovered(axes.indexOf(d)))
      .on('mouseleave', () => setHovered(null))
      .on('click', (_, d) => {
        const next = axes.indexOf(d);
        setActive(next);
        setOpenScenario(axes[next].scenarios[0]);
      });

    return () => {
      svg.selectAll('*').remove();
      marks.current = { aura: null, sel: null, dot: null, labels: null, avgDot: null, avgTip: null };
    };
  }, [axes, series, study]);

  // The average readout: positioned and filled here rather than in the draw
  // effect, so hovering never redraws the chart out from under the pointer.
  useEffect(() => {
    const tip = marks.current.avgTip;
    if (!tip) return;
    const axis = hoveredAvg === null ? null : axes[hoveredAvg];
    marks.current.avgDot?.attr('r', (_, i) => (i === hoveredAvg ? 5 : 3));
    if (!axis || axis.avg === null || axis.avg === undefined) {
      tip.attr('display', 'none');
      return;
    }
    const angle = (hoveredAvg * 2 * Math.PI) / axes.length;
    const span = axis.max - axis.min;
    const radius = span === 0 ? 0 : ((axis.avg - axis.min) / span) * RADAR_R;
    const x = radius * Math.sin(angle);
    const y = -radius * Math.cos(angle);

    const text = tip.select('.radar-avg-tip-text').text(`Everyone: ${axis.avg}/${axis.max}`);
    const box = text.node().getBBox();
    const padX = 7;
    const padY = 4;
    tip
      .select('.radar-avg-tip-box')
      .attr('x', box.x - padX)
      .attr('y', box.y - padY)
      .attr('width', box.width + padX * 2)
      .attr('height', box.height + padY * 2);
    // Above the vertex, except on the bottom one where that would sit on the
    // chart -- there it drops below instead.
    const lift = hoveredAvg === 2 ? 22 : -18;
    tip.attr('display', null).attr('transform', `translate(${x},${y + lift})`);
  }, [hoveredAvg, axes]);

  // Highlight only -- no redraw, so the marks stay put under the pointer.
  // The vertex itself is left alone: it keeps its colour and keeps pulsing,
  // and the green disc appears behind it. The breathing halo steps aside so
  // it does not wash the disc out.
  useEffect(() => {
    const lit = (_, i) => i === active || i === hovered;
    marks.current.aura?.attr('display', (d, i) => (lit(d, i) ? 'none' : null));
    marks.current.sel?.attr('display', (d, i) => (lit(d, i) ? null : 'none'));

    // All four stay legible; the selected one is the one at full strength.
    marks.current.labels?.classed('is-selected', (_, i) => i === (hovered ?? active));
  }, [active, hovered, axes]);

  // On a phone the chart is wider than the screen and scrolls sideways; open
  // it centred rather than against the left edge, so the diamond is the first
  // thing seen rather than one corner of it.
  useEffect(() => {
    const box = scrollRef.current;
    if (!box) return;
    const overflow = box.scrollWidth - box.clientWidth;
    if (overflow > 0) box.scrollLeft = overflow / 2;
  }, [axes]);

  const axis = axes[active];
  const suggestion = suggestionFor(axis);


  return (
    <div className={'radar-wrap' + (study ? ' radar-wrap--study' : '')}>
      <div className="radar-media">
        <div className="radar-scroll" ref={scrollRef}>
          <svg
            ref={ref}
            className="results-chart-svg"
            viewBox={`0 0 ${RADAR_W} ${RADAR_H}`}
            role="img"
            aria-label="Spider chart of scores by theme (placeholder data)"
          />
        {/* Lists only what was drawn -- the comparison series is absent until
            its data arrives. */}
        <div className="results-chart-legend">
          {series.map((s) => (
            <span key={s.name}>
              <i style={{ background: s.stroke }} />
              {s.name}
            </span>
          ))}
        </div>
      </div>
        {/* Stacked under the chart, inside the same frame: the two together
            fill the column beside the suggestions. Simulation Mode only --
            Study Mode's column is the suggestions ladder, and the cloud is a
            cross-player aggregate that has nothing to say next to it. */}
        {!study && <WordCloudPanel />}
      </div>
      {/* Only the selected point's detail, beside the chart. The quadrant is
          named on the chart itself now, against its own vertex. */}
      <div className="radar-detail">
        {study ? (
          <SuggestionBands axis={axis} />
        ) : (
          <>
        {/* The score lives on the chart now, under its own quadrant's name. */}
        <h4 className="radar-detail-suggest">
          Suggestions for Taking Action
          <span className="radar-detail-range">{suggestion.label}</span>
        </h4>
        <p className="radar-detail-text">{suggestion.text}</p>

        {/* Under the suggestion: the cards this quadrant is made of, as a row
            of tabs. Clicking one opens it below; clicking it again closes it,
            so there is no separate dismiss control. */}
        <div className="radar-tabs">
          <span className="radar-tabs-label">Scenarios</span>
          <div className="radar-tabs-list" role="tablist" aria-label="Scenarios in this quadrant">
            {axis.scenarios.map((n) => (
              <button
                key={n}
                type="button"
                role="tab"
                className="radar-chip"
                data-align={alignFor(answers, n)}
                aria-selected={openScenario === n}
                aria-label={`Scenario ${n}`}
                onClick={() => setOpenScenario(openScenario === n ? null : n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {openScenario && <ScenarioDetail n={openScenario} answers={answers} />}
          </>
        )}
      </div>
    </div>
  );
}

// Simulation-mode-only charts, below the share/support/facilitator row.
// The score breakdown, lifted out of the charts stack so the results screen
// can open it under the Scoring Details button instead of scrolling the
// player down to it.
export function ScoreBreakdown({ answers, study = false }) {
  return (
    <div className="score-breakdown" id="score-breakdown">
      <RadarChart answers={answers} study={study} />
    </div>
  );
}

// The cloud, self-contained: its own fetch and its own country picker, so it
// can sit inside the radar's frame without the breakdown having to know
// anything about where its words come from.
function WordCloudPanel() {
  // Which slice of the cloud is on show: the aggregate, or one country.
  const [cloudScope, setCloudScope] = useState(CLOUD_ALL);
  // Real tallies out of PostHog. `loading` is tracked apart from "no data" so
  // the panel does not flash an empty state before the fetch lands.
  const [live, setLive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchWordCloud(controller.signal).then((data) => {
      if (controller.signal.aborted) return;
      setLive(data);
      setLoading(false);
    });
    return () => controller.abort();
  }, []);

  // Alphabetical, so the picker does not reorder itself when the counts shift
  // and one country overtakes another.
  const countries = live ? Object.keys(live.byCountry).sort() : [];
  const cloudWords = live
    ? cloudScope === CLOUD_ALL
      ? live.all
      : live.byCountry[cloudScope] ?? live.all
    : [];

  // A country can drop out of the data between refreshes.
  useEffect(() => {
    if (cloudScope !== CLOUD_ALL && !countries.includes(cloudScope)) setCloudScope(CLOUD_ALL);
  }, [cloudScope, countries]);

  return (
    <div className="radar-cloud">
      <div className="results-chart-head">
        <h2 className="results-chart-title">
          What others think about environmental justice in technology
        </h2>
        {/* Nothing to filter until there are country slices to pick. */}
        {countries.length > 0 && (
          <label className="cloud-scope">
            <span className="sr-only">Filter word cloud by country</span>
            <select
              className="cloud-scope-select"
              value={cloudScope}
              onChange={(e) => setCloudScope(e.target.value)}
            >
              <option value={CLOUD_ALL}>All</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {live ? (
        <WordCloud words={cloudWords} scope={cloudScope} />
      ) : (
        // Still fetching, or there are no counts yet. Saying so beats showing
        // words nobody picked. Blank while loading, so the message does not
        // appear and then vanish.
        <p className="word-cloud-empty">{loading ? '' : 'Not enough data'}</p>
      )}
      {live && <p className="results-chart-note">What players picked on the goals screen.</p>}
    </div>
  );
}
