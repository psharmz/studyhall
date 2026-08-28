// Which build this is. Set by VITE_DEV_MODE, which lives in .env (false, the
// committed production default) and is overridden to true by .env.local, which
// is never committed.
//
// Two things hang off it: the "Go to Results Screen" shortcut is dev-only, and
// PostHog is never initialised in a dev build, so poking around the game does
// not land in the production analytics.
export const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';
