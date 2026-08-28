import posthog from 'posthog-js';
import { DEV_MODE } from './env.js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST;

// Every capture in src/telemetry.js checks this first. A production bundle
// built without the env vars stays silent rather than throwing on each event.
//
// A dev build is silent by design: the whole point is to be able to play
// through the game repeatedly without those runs showing up in the real
// project's analytics. The dev bundle is also built with the PostHog vars
// blanked, so it carries no project key at all.
export const POSTHOG_ENABLED = !DEV_MODE && Boolean(POSTHOG_KEY && POSTHOG_HOST);

if (!POSTHOG_ENABLED) {
  // Missing config is only an error for a build that meant to report. A dev
  // build opting out is the expected case, not a misconfiguration.
  if (!DEV_MODE && import.meta.env.DEV) {
    const missingVariable = !POSTHOG_KEY ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
} else {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });
}

export default posthog;
