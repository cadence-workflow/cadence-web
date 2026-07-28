import { type ChartSeriesData } from '../schedule-details-runs-chart-series.types';

const HOUR_MS = 60 * 60 * 1000;

/**
 * Builds demo series data anchored to `nowMs` rather than a fixed date, so
 * the static PR09d fixture always plots sensibly next to the live now line
 * instead of drifting arbitrarily far from it as real time passes.
 *
 * ponytail: fixture data only, replaced by live workflow data in PR09e.
 */
export default function buildScheduleRunsChartSeriesFixture(
  nowMs: number
): ChartSeriesData {
  return {
    successfulRuns: [
      { scheduledTimeMs: nowMs - 6 * HOUR_MS },
      { scheduledTimeMs: nowMs - 4 * HOUR_MS },
      { scheduledTimeMs: nowMs - 1 * HOUR_MS },
    ],
    missedExecutions: [{ scheduledTimeMs: nowMs - 2 * HOUR_MS }],
    nextExecutionTimeMs: nowMs + 2 * HOUR_MS,
  };
}
