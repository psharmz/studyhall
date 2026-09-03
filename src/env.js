// Which build this is. Set by VITE_DEV_MODE, which lives in .env (false, the
// committed production default) and is overridden to true by .env.local, which
// is never committed.
//
// It can also be switched on per-visit with ?dev=1 on the page's address, so
// the deployed production bundle doubles as a shareable dev build with no
// second deploy and no second URL to keep in sync. ?dev=0 forces it back off,
// whatever the build was compiled with.
//
// Three things hang off it: the "Restart" and "Go to Results Screen" shortcuts
// are dev-only, Dev Mode plays the short four-card deck instead of the full
// nineteen, and PostHog is never initialised, so poking around the game does
// not land in the production analytics.
const BUILD_DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

// null when ?dev is absent, so the build's own setting still decides.
function devFromUrl() {
  if (typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('dev');
  if (value === null) return null;
  return value !== '0' && value !== 'false';
}

export const DEV_MODE = devFromUrl() ?? BUILD_DEV_MODE;
