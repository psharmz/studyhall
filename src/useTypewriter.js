import { useCallback, useEffect, useRef, useState } from 'react';

// Reveals `text` one character at a time. Returns the visible slice, a done
// flag, and skip() to jump straight to the full text.
// The visible count is derived from elapsed time (not one tick per char)
// so browser timer throttling can't stretch the animation out.
export function useTypewriter(text, { speed = 14, active = true } = {}) {
  const [count, setCount] = useState(0);
  const skippedRef = useRef(false);

  useEffect(() => {
    setCount(0);
    skippedRef.current = false;
    if (!active || !text) return undefined;
    const start = performance.now();
    const interval = setInterval(() => {
      if (skippedRef.current) {
        clearInterval(interval);
        return;
      }
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

  const skip = useCallback(() => {
    skippedRef.current = true;
    setCount(text.length);
  }, [text]);

  return { visible: text.slice(0, count), done: count >= text.length, skip };
}
