import { useEffect, useState } from 'react';

// Reveals `text` one character at a time. Returns the visible slice and a
// done flag. Resets whenever `text` changes or `active` flips back on.
// The visible count is derived from elapsed time (not one tick per char)
// so browser timer throttling can't stretch the animation out.
export function useTypewriter(text, { speed = 14, active = true } = {}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (!active || !text) return undefined;
    const start = performance.now();
    const interval = setInterval(() => {
      const chars = Math.floor((performance.now() - start) / speed);
      if (chars >= text.length) {
        setCount(text.length);
        clearInterval(interval);
      } else {
        setCount(chars);
      }
    }, 33);
    return () => clearInterval(interval);
  }, [text, active, speed]);

  return { visible: text.slice(0, count), done: count >= text.length };
}
