export const CHART_WORKFLOWS_PAGE_SIZE = 20;

export const SCHEDULE_BACKFILL_SEARCH_ATTRIBUTE = 'CadenceScheduleBackfillID';

/** How often the schedule description is repolled for a live next-run time and run count (ms). */
export const CHART_DESCRIBE_REFRESH_INTERVAL_MS = 10_000;

/**
 * Refreshing the runs re-walks every loaded page, so it runs on a slower beat
 * than the schedule itself. New runs do not wait for it: they arrive as soon
 * as the schedule's `totalRuns` changes, which is polled at the faster
 * interval above. This only bounds how long an older run can keep showing a
 * stale status.
 */
export const CHART_WORKFLOWS_REFRESH_INTERVAL_MS = 60_000;

/** Upper bound on cron occurrences walked when inferring skipped/unconfirmed slots. */
export const MAX_SCHEDULE_CRON_OCCURRENCES = 10_000;
