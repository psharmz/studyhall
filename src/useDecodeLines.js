import { useCallback, useEffect, useRef, useState } from 'react';

// Glyph pool for the unresolved characters: hex, ASCII punctuation, katakana
// and block characters -- the alphabet of every 90s decode montage.
const GLYPHS = '0123456789ABCDEF#%&$@*<>[]{}/\\|=+-_~^アイウエオカキクケコサシスセソタチツテトナニヌネノ▓▒░█';

// How long one character takes to resolve, and how far apart the lines start.
const CHAR_MS = 2.4;
const LINE_STAGGER = 130;
const TICK_MS = 33;

function glyph() {
  return GLYPHS[(Math.random() * GLYPHS.length) | 0];
}

// Reveals an array of lines as a burst of noise resolving left to right, one
// line after another. Every line keeps its final length and its spaces from
// the first frame, so a monospace paragraph never reflows while it settles.
//
// One interval drives every line -- the visible state is derived from elapsed
// time rather than advanced per tick, so throttling can't stretch it out.
export function useDecodeLines(lines, { active = true } = {}) {
  const [elapsed, setElapsed] = useState(active ? 0 : Infinity);
  const doneRef = useRef(!active);

  const total =
    (lines.length - 1) * LINE_STAGGER +
    Math.max(...lines.map((l) => l.length)) * CHAR_MS;

  useEffect(() => {
    if (!active) {
      setElapsed(Infinity);
      doneRef.current = true;
      return undefined;
    }
    setElapsed(0);
    doneRef.current = false;
    const start = performance.now();
    const interval = setInterval(() => {
      if (doneRef.current) {
        clearInterval(interval);
        return;
      }
      const t = performance.now() - start;
      setElapsed(t);
      if (t >= total) {
        doneRef.current = true;
        clearInterval(interval);
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [lines, active, total]);

  const finish = useCallback(() => {
    doneRef.current = true;
    setElapsed(Infinity);
  }, []);

  const decoded = lines.map((line, i) => {
    const since = elapsed - i * LINE_STAGGER;
    if (since <= 0) return { text: '', started: false, done: false };
    const resolved = Math.min(line.length, Math.floor(since / CHAR_MS));
    if (resolved >= line.length) return { text: line, started: true, done: true };
    // Whitespace stays whitespace so word wrapping is settled from frame one.
    const noise = Array.from(line.slice(resolved), (c) => (c === ' ' ? ' ' : glyph())).join('');
    return { text: line.slice(0, resolved) + noise, started: true, done: false };
  });

  return { decoded, done: elapsed >= total, finish, duration: total };
}
