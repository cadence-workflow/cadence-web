import { type ScheduleMetricsChartSeriesData } from '../schedule-detail-metrics-chart-series.types';

export const SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS = new Date(
  '2024-06-15T12:00:00.000Z'
).getTime();

export const scheduleMetricsChartFixture: ScheduleMetricsChartSeriesData = {
  successfulRuns: [
    { scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 6 * 60 * 60 * 1000 },
    { scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 4 * 60 * 60 * 1000 },
    { scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 1 * 60 * 60 * 1000 },
  ],
  missedExecutions: [
    { scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 2 * 60 * 60 * 1000 },
  ],
  nextExecutionTimeMs:
    SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS + 2 * 60 * 60 * 1000,
};
