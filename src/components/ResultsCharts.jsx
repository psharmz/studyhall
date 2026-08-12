import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

// PLACEHOLDER DATA -- both charts are wired to stand-in values until the real
// per-player aggregates exist. Swap these two consts out, nothing else.
const WORDS = [
  { text: 'extraction', size: 44 },
  { text: 'water', size: 38 },
  { text: 'consent', size: 34 },
  { text: 'labor', size: 32 },
  { text: 'emissions', size: 30 },
  { text: 'land', size: 28 },
  { text: 'e-waste', size: 26 },
  { text: 'community', size: 25 },
  { text: 'datacenter', size: 24 },
  { text: 'cobalt', size: 22 },
  { text: 'offset', size: 21 },
  { text: 'refusal', size: 20 },
  { text: 'sovereignty', size: 19 },
  { text: 'cooling', size: 18 },
  { text: 'repair', size: 18 },
  { text: 'lithium', size: 17 },
  { text: 'audit', size: 16 },
  { text: 'grid', size: 16 },
  { text: 'disclosure', size: 15 },
  { text: 'moratorium', size: 14 },
  { text: 'accountability', size: 14 },
  { text: 'stewardship', size: 13 },
  { text: 'harm', size: 13 },
  { text: 'scale', size: 12 },
];

// Four themes, clockwise from the top vertex. `title` is pre-split into lines
// because SVG text does not wrap on its own.
const RADAR_AXES = [
  {
    title: ['Designing with Power and Positionality in Mind'],
    scenarios: [1, 3, 4],
    you: 5,
    avg: 15,
  },
  {
    title: ['Restructuring Innovation for', 'Collective Flourishing'],
    scenarios: [2, 6, 11, 13],
    you: 22,
    avg: 13,
  },
  {
    title: ['Reorienting the Relationship Between Technology and Nature'],
    scenarios: [7, 8, 14, 16],
    you: 24,
    avg: 11,
  },
  {
    title: ['Embedding Access, Accountability,', 'and Reparative Practice'],
    scenarios: [5, 9, 10, 12],
    you: 20,
    avg: 9,
  },
];

const RADAR_MAX = 30;
const RADAR_SERIES = [
  { key: 'you', name: 'Your score', stroke: '#A9E9E4', fill: 'rgba(124, 186, 186, 0.42)' },
  {
    key: 'avg',
    name: 'Avg. score of all participants',
    stroke: '#8C8377',
    fill: 'rgba(140, 131, 119, 0.34)',
  },
];

const CLOUD_W = 400;
const CLOUD_H = 300;
// Wide box: the axis labels need far more room than the web itself.
const RADAR_W = 960;
const RADAR_H = 620;
const RADAR_CX = 480;
const RADAR_CY = 310;
const RADAR_R = 185;
const RADAR_RINGS = 4;
const LABEL_LINE = 17;
const CHIP_H = 20;
const CHIP_ROW = 26;
const CHIP_PER_ROW = 3;
const CHIP_GAP = 8;
const CHIP_PAD = 9;
// Mono font, so a character's width is a fixed fraction of its size.
const CHIP_CHAR = 6.7;
const CALLOUT_W = 300;
const CALLOUT_H = 58;
// Top-left of the callout for each axis, relative to the centre.
const CALLOUT_OFFSET = [
  [175, -215],
  [150, 62],
  [-455, 118],
  [-400, 62],
];
const MONO = "'JetBrains Mono', monospace";

function WordCloud() {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const color = d3.scaleOrdinal().range(['#7CFA6B', '#4DA8DA', '#E8E8E8', '#9A9A9A', '#4E9E45']);

    // d3-cloud lays out asynchronously off a canvas measure pass, so the
    // draw happens in its 'end' callback rather than inline.
    const layout = cloud()
      .size([CLOUD_W, CLOUD_H])
      .words(WORDS.map((w) => ({ ...w })))
      .padding(2)
      .rotate((_, i) => (i % 3 === 0 ? 90 : 0))
      .font(MONO)
      .fontWeight(700)
      .fontSize((d) => d.size * 0.62)
      .on('end', (words) => {
        svg
          .append('g')
          .attr('transform', `translate(${CLOUD_W / 2},${CLOUD_H / 2})`)
          .selectAll('text')
          .data(words)
          .join('text')
          .attr('font-family', MONO)
          .attr('font-weight', 700)
          .attr('font-size', (d) => `${d.size}px`)
          .attr('fill', (d, i) => color(i))
          .attr('text-anchor', 'middle')
          .attr('transform', (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
          .text((d) => d.text);
      });

    layout.start();

    return () => {
      layout.stop();
      svg.selectAll('*').remove();
    };
  }, []);

  return (
    <svg
      ref={ref}
      className="results-chart-svg"
      viewBox={`0 0 ${CLOUD_W} ${CLOUD_H}`}
      role="img"
      aria-label="Word cloud of themes (placeholder data)"
    />
  );
}

function RadarChart() {
  const ref = useRef(null);
  // Which vertex the score callout points at; hovering an axis moves it.
  const [active, setActive] = useState(0);
  // The vertex actually under the cursor, if any -- it goes solid red.
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const g = svg.append('g').attr('transform', `translate(${RADAR_CX},${RADAR_CY})`);

    const r = d3.scaleLinear().domain([0, RADAR_MAX]).range([0, RADAR_R]);
    const angle = (i) => (i * 2 * Math.PI) / RADAR_AXES.length;
    const px = (radius, i) => radius * Math.sin(angle(i));
    const py = (radius, i) => -radius * Math.cos(angle(i));
    const ring = (radius) => RADAR_AXES.map((_, i) => `${px(radius, i)},${py(radius, i)}`).join(' ');

    // Web: nested diamonds -- each ring is the axis polygon itself rather
    // than a circle -- plus a spoke out to every vertex.
    g.selectAll('.radar-ring')
      .data(d3.range(1, RADAR_RINGS + 1).map((i) => (i / RADAR_RINGS) * RADAR_R))
      .join('polygon')
      .attr('class', 'radar-ring')
      .attr('points', (d) => ring(d))
      .attr('fill', 'none')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-opacity', (_, i) => (i === RADAR_RINGS - 1 ? 0.85 : 0.3));

    g.selectAll('.radar-spoke')
      .data(RADAR_AXES)
      .join('line')
      .attr('class', 'radar-spoke')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (_, i) => px(RADAR_R, i))
      .attr('y2', (_, i) => py(RADAR_R, i))
      .attr('stroke', '#FFFFFF')
      .attr('stroke-opacity', 0.3);

    // Axis labels: bold theme name, an "average of" line, then one chip per
    // scenario. Top and bottom sit close to their vertex; the side labels
    // need more clearance.
    const groups = g
      .selectAll('.radar-axis-label')
      .data(RADAR_AXES)
      .join('g')
      .attr('class', 'radar-axis-label')
      .attr(
        'transform',
        (_, i) =>
          `translate(${px(RADAR_R + (i % 2 === 0 ? 62 : 150), i)},${py(
            RADAR_R + (i % 2 === 0 ? 62 : 150),
            i
          )})`
      );

    groups.each(function (d) {
      const gg = d3.select(this);
      const lines = [...d.title, 'average of'];
      // Chips wrap at three per row, balanced -- four scenarios read better
      // as 2 + 2 than as 3 + 1.
      const rowCount = Math.ceil(d.scenarios.length / CHIP_PER_ROW);
      const perRow = Math.ceil(d.scenarios.length / rowCount);
      const rows = d3.range(rowCount).map((i) => d.scenarios.slice(i * perRow, (i + 1) * perRow));
      // The whole block (title lines + caption + chip rows) is centred on the
      // label anchor, so it grows symmetrically away from the vertex.
      const height = (lines.length - 1) * LABEL_LINE + LABEL_LINE + rowCount * CHIP_ROW;
      const top = -height / 2;

      const text = gg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-family', MONO)
        .attr('fill', 'var(--green)')
        .attr('y', top + 11);

      lines.forEach((str, i) => {
        text
          .append('tspan')
          .attr('x', 0)
          .attr('dy', i === 0 ? 0 : LABEL_LINE)
          .attr('font-size', i === lines.length - 1 ? '12px' : '13.5px')
          .attr('font-weight', i === lines.length - 1 ? 400 : 700)
          .attr('fill-opacity', i === lines.length - 1 ? 0.75 : 1)
          .text(str);
      });

      // Chips: mono, so widths come straight off the character count. Each
      // row is centred on the anchor independently.
      const chipW = (n) => `scenario ${n}`.length * CHIP_CHAR + CHIP_PAD * 2;
      const placed = [];
      rows.forEach((row, rowIndex) => {
        const rowW = d3.sum(row, chipW) + CHIP_GAP * (row.length - 1);
        let x = -rowW / 2;
        row.forEach((n) => {
          placed.push({ n, x, y: top + lines.length * LABEL_LINE + 6 + rowIndex * CHIP_ROW });
          x += chipW(n) + CHIP_GAP;
        });
      });

      const chips = gg
        .selectAll('.radar-chip')
        .data(placed)
        .join('g')
        .attr('class', 'radar-chip')
        .attr('transform', (c) => `translate(${c.x},${c.y})`);

      chips
        .append('rect')
        .attr('width', (c) => chipW(c.n))
        .attr('height', CHIP_H)
        .attr('rx', 2)
        .attr('fill', 'rgba(124, 250, 107, 0.08)')
        .attr('stroke', 'var(--green)')
        .attr('stroke-opacity', 0.45);

      chips
        .append('text')
        .attr('x', (c) => chipW(c.n) / 2)
        .attr('y', CHIP_H / 2 + 4)
        .attr('text-anchor', 'middle')
        .attr('font-family', MONO)
        .attr('font-size', '11px')
        .attr('fill', 'var(--green)')
        .text((c) => `scenario ${c.n}`);
    });

    const line = d3
      .lineRadial()
      .radius((d) => r(d))
      .angle((_, i) => angle(i))
      .curve(d3.curveLinearClosed);

    g.selectAll('.radar-area')
      .data(RADAR_SERIES)
      .join('path')
      .attr('class', 'radar-area')
      .attr('d', (s) => line(RADAR_AXES.map((a) => a[s.key])))
      .attr('fill', (s) => s.fill)
      .attr('stroke', (s) => s.stroke)
      .attr('stroke-width', 2);

    RADAR_SERIES.forEach((s) => {
      const dots = g.append('g');

      // The "your score" vertices are the hoverable ones, so they get a soft
      // halo and a slow breath to draw the eye. Staggered per axis. The one
      // under the cursor drops the halo and settles into a bigger red dot.
      if (s.key === 'you') {
        dots
          .selectAll('.radar-dot-aura')
          .data(RADAR_AXES.map((a) => a[s.key]))
          .join('circle')
          .attr('class', 'radar-dot-aura')
          .attr('cx', (d, i) => px(r(d), i))
          .attr('cy', (d, i) => py(r(d), i))
          .attr('r', 9)
          .attr('fill', s.stroke)
          .attr('display', (_, i) => (i === hovered ? 'none' : null))
          .style('animation-delay', (_, i) => `${i * 0.45}s`);
      }

      dots
        .selectAll('.radar-dot')
        .data(RADAR_AXES.map((a) => a[s.key]))
        .join('circle')
        .attr('class', (_, i) => {
          if (s.key !== 'you') return 'radar-dot';
          return i === hovered ? 'radar-dot radar-dot--hovered' : 'radar-dot radar-dot--you';
        })
        .attr('cx', (d, i) => px(r(d), i))
        .attr('cy', (d, i) => py(r(d), i))
        .attr('r', (_, i) => (s.key === 'you' && i === hovered ? 6 : 3))
        .attr('fill', (_, i) => (s.key === 'you' && i === hovered ? 'var(--red)' : s.stroke))
        .style('animation-delay', (_, i) => `${i * 0.45}s`);
    });

    // Callout, pointing at the active vertex of the "your score" ring.
    const axis = RADAR_AXES[active];
    const [bx, by] = CALLOUT_OFFSET[active];
    const vx = px(r(axis.you), active);
    const vy = py(r(axis.you), active);
    const box = g.append('g').attr('class', 'radar-callout');

    // The arrow leaves whichever side of the box faces the vertex, and stops
    // a little short of it.
    const fromX = vx < bx ? bx - 6 : bx + CALLOUT_W + 6;
    const fromY = by + CALLOUT_H / 2;
    const dx = vx - fromX;
    const dy = vy - fromY;
    const len = Math.hypot(dx, dy) || 1;
    const tipX = vx - (dx / len) * 12;
    const tipY = vy - (dy / len) * 12;

    box
      .append('line')
      .attr('x1', fromX)
      .attr('y1', fromY)
      .attr('x2', tipX)
      .attr('y2', tipY)
      .attr('stroke', 'var(--blue)')
      .attr('stroke-width', 4);

    box
      .append('polygon')
      .attr('points', '0,-7 12,0 0,7')
      .attr('fill', 'var(--blue)')
      .attr(
        'transform',
        `translate(${tipX},${tipY}) rotate(${(Math.atan2(dy, dx) * 180) / Math.PI})`
      );

    box
      .append('rect')
      .attr('x', bx)
      .attr('y', by)
      .attr('width', CALLOUT_W)
      .attr('height', CALLOUT_H)
      .attr('fill', 'var(--black)')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2.5);

    const callout = box
      .append('text')
      .attr('x', bx + 14)
      .attr('y', by + 23)
      .attr('font-family', MONO)
      .attr('font-size', '12.5px')
      .attr('font-weight', 700)
      .attr('fill', 'var(--green)');
    callout.append('tspan').attr('x', bx + 14).text(`Your score: ${axis.you}/${RADAR_MAX}`);
    callout
      .append('tspan')
      .attr('x', bx + 14)
      .attr('dy', 20)
      .text(`Avg. score of all participants: ${axis.avg}/${RADAR_MAX}`);

    // Generous invisible hit targets on each vertex drive the callout.
    g.append('g')
      .selectAll('circle')
      .data(RADAR_AXES)
      .join('circle')
      .attr('cx', (d, i) => px(r(d.you), i))
      .attr('cy', (d, i) => py(r(d.you), i))
      .attr('r', 20)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mouseenter', (_, d) => {
        const i = RADAR_AXES.indexOf(d);
        setActive(i);
        setHovered(i);
      })
      .on('mouseleave', () => setHovered(null));

    return () => {
      svg.selectAll('*').remove();
    };
  }, [active, hovered]);

  return (
    <svg
      ref={ref}
      className="results-chart-svg"
      viewBox={`0 0 ${RADAR_W} ${RADAR_H}`}
      role="img"
      aria-label="Spider chart of scores by theme (placeholder data)"
    />
  );
}

// Simulation-mode-only charts, below the share/support/facilitator row.
export function ResultsCharts() {
  return (
    <div className="results-charts">
      <div className="results-chart">
        <h2 className="results-chart-title">What Everyone Is Saying</h2>
        <WordCloud />
      </div>
      <div className="results-chart results-chart--wide">
        <h2 className="results-chart-title results-chart-title--big">Score breakdown</h2>
        <RadarChart />
        <div className="results-chart-legend">
          {RADAR_SERIES.map((s) => (
            <span key={s.name}>
              <i style={{ background: s.stroke }} />
              {s.name}
            </span>
          ))}
        </div>
      </div>
      <p className="results-chart-note">Placeholder data &mdash; not yet wired to your answers.</p>
    </div>
  );
}
