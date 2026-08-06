import { useEffect, useRef } from 'react';

// Length of the CSS bloom; the safety timer below only fires if the
// animationend event never arrives (reduced motion, backgrounded tab).
const DURATION_MS = 1500;

// Full-bleed black interstitial played before every prompt screen. The
// halftone bloom itself is pure CSS -- this only listens for its end.
export function PromptTransition({ onDone }) {
  const finished = useRef(false);

  function finish() {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }

  useEffect(() => {
    const timer = setTimeout(finish, DURATION_MS + 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="transition-screen">
      <div
        className="halo"
        onAnimationEnd={(e) => {
          if (e.animationName === 'haloBloom') finish();
        }}
      />
    </div>
  );
}
