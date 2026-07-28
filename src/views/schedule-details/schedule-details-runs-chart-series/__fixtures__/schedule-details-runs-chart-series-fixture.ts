import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import { type ChartSeriesData } from '../schedule-details-runs-chart-series.types';

const HOUR_MS = 60 * 60 * 1000;

/**
 * Builds demo series data anchored to `nowMs` rather than a fixed date, so
 * the static PR09d fixture always plots sensibly next to the live now line
 * instead of drifting arbitrarily far from it as real time passes. Covers
 * every status channel plus a backfill badge and a grouped pair so the
 * design can be reviewed without live data.
 *
 * ponytail: fixture data only, replaced by live workflow data in PR09e.
 */
export default function buildScheduleRunsChartSeriesFixture(
  nowMs: number
): ChartSeriesData {
  return {
    runs: [
      {
        runId: 'fixture-run-1',
        scheduledTimeMs: nowMs - 6 * HOUR_MS,
        status: WORKFLOW_STATUSES.completed,
      },
      {
        runId: 'fixture-run-2',
        scheduledTimeMs: nowMs - 5 * HOUR_MS,
        status: WORKFLOW_STATUSES.failed,
      },
      {
        runId: 'fixture-run-3',
        scheduledTimeMs: nowMs - 4 * HOUR_MS,
        status: WORKFLOW_STATUSES.canceled,
        isBackfill: true,
      },
      {
        runId: 'fixture-run-4',
        scheduledTimeMs: nowMs - 1 * HOUR_MS,
        status: WORKFLOW_STATUSES.completed,
      },
      {
        runId: 'fixture-run-5',
        scheduledTimeMs: nowMs - 1 * HOUR_MS,
        status: WORKFLOW_STATUSES.failed,
      },
      {
        runId: 'fixture-run-6',
        scheduledTimeMs: nowMs - 30 * 60_000,
        status: WORKFLOW_STATUSES.running,
      },
    ],
    skippedExecutions: [{ scheduledTimeMs: nowMs - 2 * HOUR_MS }],
    nextExecutionTimeMs: nowMs + 2 * HOUR_MS,
  };
}
