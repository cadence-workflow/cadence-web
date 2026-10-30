export const QUERY_PARAMS_SYNC_EVENT = 'cadence:page-query-params';

// ponytail: Next has no event for its delayed History writes. These checks
// cover the current delay. Replace them if Next exposes a matching event.
export const WATCHDOG_DELAY_MS = 50;
export const WATCHDOG_RECHECK_MS = 200;
