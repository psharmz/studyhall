import { useEffect, useState } from 'react';

// The phone layout is a different interaction, not just different CSS, so the
// components that switch on it need to know in JS rather than in a media query.
// One definition, shared, because a disagreement about where the breakpoint
// falls would show up as a layout that half-changes.
const PHONE = '(max-width: 700px)';

export function useIsPhone() {
  const [isPhone, setIsPhone] = useState(() => window.matchMedia?.(PHONE).matches ?? false);

  useEffect(() => {
    const mq = window.matchMedia?.(PHONE);
    if (!mq) return undefined;
    const onChange = (e) => setIsPhone(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isPhone;
}
