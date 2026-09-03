import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { fetchWordCloud, fetchQuadrantAverages } from '../aggregates.js';
import quadrantMap from '../../quadrants.json';
import { SCENARIOS, ALIGN_LABELS } from '../scenarios.js';
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

// A fully aligned answer is worth 5, so a quadrant's ceiling is 5 per card.
const POINTS_PER_CARD = 5;

const RADAR_AXES_BASE = [
  {
    slug: 'power_positionality',
    title: ['Designing with Power and Positionality in Mind'],
    suggestions: [
      {
        max: 11,
        label: 'Learning with others',
        text: 'Look around you. What technologies do people around you use daily and which ones are not accessible to them? Who made these technologies? Do you know how they serve your community and how they serve those that built it? Whose interests are really at the center of the development and usage of these tools? Here you can also map assumptions, observations and understandings about race, colonialism, and power as they relate to the history of the people that use and build the tools.',
      },
      {
        max: 23,
        label: 'Mapping the systems',
        text: 'Have you ever considered applying your knowledge to build a table comparing community-owned/open source and mainstream/commercial alternatives to the tech used by you and those in your community? How do they compare beyond available features and aesthetics? For example, are there power asymmetries that can further reinforce the position of those with already a lot of power? How do these asymmetries are embedded in the tech lifecycle from early development to usage, and disposal or composting? How these asymmetries are reinforced or hindered by the interaction between the different technologies in your community?',
      },
      {
        max: 35,
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
        max: 8,
        label: 'Learning with others',
        text: 'Look around you. What technologies do people around you use daily and which ones are not accessible to them? Talk to people and ask if they understand the trade offs of the technologies that are accessible to them - for example, do free tools require collection of personal information? Start a simple map with the information you gather from others and try to understand how their life story relates to how they use, understand, talk about technology.',
      },
      {
        max: 16,
        label: 'Mapping the systems',
        text: 'Have you ever considered using the knowledge you have to a create comparative table of relevant technologies to your community? You can help moving towards a more just future with technology by comparing aspects such as documentations access, repairability, modification rights, who benefits, who might be harmed (humans and non-humans) and how harms can be handle if they happen. You can also take a step further and look at such aspects of comparison within the lifecycle of the technology to understand more about the impact of its creation (e.g., resource extraction), usage (including in its interaction with other technologies), and disposal.',
      },
      {
        max: 25,
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
        max: 6,
        label: 'Learning with others',
        text: 'Have you taken some time to notice the examples of innovation around you? Which ones often appear in the news, workplaces, and other environments that are part of your reality and that of your community? What makes those technologies innovative? Who defines what is innovative? What types of knowledge are centered and which ones are ignored in these technologies? What is their main impact and purpose - speed, novelty, capital and wealth? Historically, have they enable collective flourishing or individual competition?',
      },
      {
        max: 13,
        label: 'Mapping the systems',
        text: 'Have you consider using your knowledge to compare venture-capital/market-driven innovations with community-led/mutual aid innovation? What forms of legal structures are present in each? What incentives and barriers facilitate or difficult their development? Which of them has historically shown a relative higher rate of harms and unintended consequences? How do market-driven innovations interact within themselves? What about community-led innovations? Finally, how do market-driven and community-led innovations interact with each other - do they collaborate or compete? Who often loses? Why?',
      },
      {
        max: 20,
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
        max: 6,
        label: 'Learning with others',
        text: 'Take some time to notice the type of technology most used in your community. What materials are used in this technology? Where do these materials come from? What type of energy (e.g., hydro, coal, gas, solar, wind...) supplies these technologies and your community? How is the infrastructure that supports these technologies exploit versus care about nature? How do people in your community talk about and relate to non-human life? What practices do they have that show alignment or dealignment with the technologies used? How has technology historically influenced the changes in these practices of relationship with nature in your community?',
      },
      {
        max: 13,
        label: 'Mapping the systems',
        text: 'Have you consider using your knowledge to compare the extractive technologies with regenerative alternatives? How do they relate and learn from nature? How do they support people\'s relationship with other forms of life and their supporting environment? What forms of energy they use? What are their ecosystem impacts, who bears the harms, and how restoration responds to the harms cause by each of them? Finally, can you map these aspects in each stage of the technology lifecycle and in their interactions with other technologies that are involved in the creation, usage, and disposal of restorative versus regenerative tech?',
      },
      {
        max: 20,
        label: 'Helping others',
        text: 'Your knowledge can support a more just future! Consider writing a public policy draft or a design process that supports technologies that restore instead of exploit life on Earth. How should work relationship be set in such a restorative perspective? What is the value of life beyond its transformation into products and materials? What indicators of regeneration, local ecological limits, and harm should be considered? How can the participation of peoples with different forms of knowledge, such as indigenous peoples and traditional communities, be essential in such a transformation? How may historical harms be taken into account, linking technology development to restoration and reconciliation funds and actions? Embed lessons into the document to model scientific, ecological, and political humility and accountability.',
      },
    ],
  },
];

export const RADAR_AXES = RADAR_AXES_BASE.map((axis) => {
  const scenarios = SCENARIOS_BY_SLUG[axis.slug];
  return { ...axis, scenarios, max: scenarios.length * POINTS_PER_CARD };
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

const CLOUD_W = 400;
const CLOUD_H = 300;
// A diamond, with all four quadrants named around it and their scores beneath.
// The canvas is mostly margin: the web itself is small relative to the room the
// four headers need above, below and either side of it.
const RADAR_W = 760;
const RADAR_H = 560;
const RADAR_CX = 380;
const RADAR_CY = 280;
const RADAR_R = 148;
const RADAR_RINGS = 4;
// Where a header sits relative to its vertex, and how wide it may run before
// wrapping (mono, so a character is a predictable fraction of the size).
const LABEL_GAP = 18;
const LABEL_SIZE = 15;
const LABEL_LINE = 18;
const LABEL_WRAP = 20;
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

// What one scenario chip opens: what they answered, what the aligned answer
// was, the scenario itself, and why that answer is the aligned one. Replaces
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
          {picked.text}
          <span className="scenario-detail-align">{ALIGN_LABELS[picked.align]}</span>
        </p>
      ) : (
        <p className="scenario-detail-note">You did not play this scenario.</p>
      )}

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

      <h5 className="scenario-detail-label">The scenario</h5>
      {scenario.paragraphs.map((para) => (
        <p key={para.slice(0, 40)} className="scenario-detail-prompt">
          {para}
        </p>
      ))}

      <h5 className="scenario-detail-label">Why</h5>
      {aligned.map((o) => (
        <p key={o.text} className="scenario-detail-why">
          {o.explanation}
        </p>
      ))}
    </div>
  );
}

// The web on its own -- no titles, no chips, no callout. Everything about the
// selected vertex is read off the card beside it instead, which is why the
// box is only as wide as the chart now.
function RadarChart({ answers: realAnswers }) {
  // A dev build with nothing played falls back to stub answers, so the chart,
  // the chips and the per-scenario detail can all be looked at without playing
  // nineteen cards first. Never in a production build.
  const answers =
    DEV_MODE && !Object.keys(realAnswers ?? {}).length ? DEV_STUB_ANSWERS : realAnswers;

  // Which scenario chip is open, if any. Null shows the suggestions instead.
  const [openScenario, setOpenScenario] = useState(null);

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

  // Drawn series: the average one only once its data is in.
  const series = useMemo(
    () => (averages ? RADAR_SERIES : RADAR_SERIES.filter((s) => s.key !== 'avg')),
    [averages]
  );

  useEffect(() => {
    const svg = d3.select(ref.current);
    const g = svg.append('g').attr('transform', `translate(${RADAR_CX},${RADAR_CY})`);

    // Quadrants hold different numbers of cards, so a spoke is plotted as a
    // fraction of its own max -- otherwise the 30-point quadrant would always
    // dwarf the 20-point ones and the shape would say nothing about how the
    // player actually did.
    const r = (value, i) => (value / axes[i].max) * RADAR_R;
    const angle = (i) => (i * 2 * Math.PI) / axes.length;
    const px = (radius, i) => radius * Math.sin(angle(i));
    const py = (radius, i) => -radius * Math.cos(angle(i));
    const ring = (radius) => axes.map((_, i) => `${px(radius, i)},${py(radius, i)}`).join(' ');

    // Web: nested polygons on the axes themselves, plus a spoke to each vertex.
    g.selectAll('.radar-ring')
      .data(d3.range(1, RADAR_RINGS + 1).map((i) => (i / RADAR_RINGS) * RADAR_R))
      .join('polygon')
      .attr('class', 'radar-ring')
      .attr('points', (d) => ring(d))
      .attr('fill', 'none')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-opacity', (_, i) => (i === RADAR_RINGS - 1 ? 0.85 : 0.3));

    g.selectAll('.radar-spoke')
      .data(axes)
      .join('line')
      .attr('class', 'radar-spoke')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (_, i) => px(RADAR_R, i))
      .attr('y2', (_, i) => py(RADAR_R, i))
      .attr('stroke', '#FFFFFF')
      .attr('stroke-opacity', 0.3);

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
    });

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
        setActive(axes.indexOf(d));
        setOpenScenario(null);
      });

    marks.current.labels.each(function (d, i) {
      const group = d3.select(this);
      const [x, y] = [px(RADAR_R + LABEL_GAP, i), py(RADAR_R + LABEL_GAP, i)];
      const lines = wrapLabel(d.title.join(' '), LABEL_WRAP);
      // Top and bottom read centred over their point; the sides read outward.
      const anchor = i === 0 || i === 2 ? 'middle' : i === 1 ? 'start' : 'end';
      // The block hangs above the top vertex, below the bottom one, and is
      // centred on the two at the sides. +1 line for the score underneath.
      const total = lines.length + 1;
      const firstY =
        i === 0 ? y - (total - 1) * LABEL_LINE : i === 2 ? y + LABEL_LINE : y - ((total - 1) * LABEL_LINE) / 2;

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

      // Score sits under its own quadrant's name rather than in the card.
      group
        .append('text')
        .attr('class', 'radar-axis-score')
        .attr('x', x)
        .attr('y', firstY + lines.length * LABEL_LINE)
        .attr('text-anchor', anchor)
        .attr('font-size', LABEL_SIZE)
        .attr('font-weight', 700)
        .text(`${d.you}/${d.max}`);
    });

    // Generous invisible hit targets on each vertex drive the detail card.
    g.append('g')
      .selectAll('circle')
      .data(axes)
      .join('circle')
      .attr('cx', (d, i) => px(r(d.you, i), i))
      .attr('cy', (d, i) => py(r(d.you, i), i))
      .attr('r', 20)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mouseenter', (_, d) => setHovered(axes.indexOf(d)))
      .on('mouseleave', () => setHovered(null))
      .on('click', (_, d) => {
        setActive(axes.indexOf(d));
        setOpenScenario(null);
      });

    return () => {
      svg.selectAll('*').remove();
      marks.current = { aura: null, sel: null, dot: null, labels: null };
    };
  }, [axes, series]);

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
    <div className="radar-wrap">
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
          {/* Only when it is a real sample -- the dev stub reports zero runs. */}
          {averages?.[axis.slug]?.runs > 0 && (
            <span className="radar-legend-n">from {averages[axis.slug].runs} players</span>
          )}
        </div>
      </div>
      {/* Only the selected point's detail, beside the chart. The quadrant is
          named on the chart itself now, against its own vertex. */}
      <div className="radar-detail">
        {/* The score lives on the chart now, under its own quadrant's name. */}
        <h4 className="radar-detail-suggest">
          Suggestions for Taking Action
          <span className="radar-detail-range">{suggestion.label}</span>
        </h4>
        <p className="radar-detail-text">{suggestion.text}</p>

        {/* Under the suggestion: the cards this quadrant is made of. Clicking
            one opens it below; clicking it again closes it, so there is no
            separate dismiss control. */}
        <p className="radar-detail-comprised">
          comprised by
          {axis.scenarios.map((n) => (
            <button
              key={n}
              type="button"
              className="radar-chip"
              data-align={alignFor(answers, n)}
              aria-pressed={openScenario === n}
              onClick={() => setOpenScenario(openScenario === n ? null : n)}
            >
              Scenario {n}
            </button>
          ))}
        </p>

        {openScenario && <ScenarioDetail n={openScenario} answers={answers} />}
      </div>
    </div>
  );
}

// Simulation-mode-only charts, below the share/support/facilitator row.
// The score breakdown, lifted out of the charts stack so the results screen
// can open it under the Scoring Details button instead of scrolling the
// player down to it.
export function ScoreBreakdown({ answers }) {
  return (
    <div className="score-breakdown" id="score-breakdown">
      <RadarChart answers={answers} />
    </div>
  );
}

export function ResultsCharts({ answers }) {
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
    <div className="results-charts">
      <div className="results-chart results-chart--cloud">
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
          // Still fetching, or there are no counts yet. Saying so beats
          // showing words nobody picked. Blank while loading, so the message
          // does not appear and then vanish.
          <p className="word-cloud-empty">{loading ? '' : 'Not enough data'}</p>
        )}
      </div>
      {live && (
        <p className="results-chart-note">What players picked on the goals screen.</p>
      )}
    </div>
  );
}
