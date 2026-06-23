import { type ScheduleMetricsChartSeriesData } from '../schedule-detail-metrics-chart-series.types';

export const SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS = new Date(
  '2024-06-15T12:00:00.000Z'
).getTime();

const HOUR_MS = 60 * 60 * 1000;

export const scheduleMetricsChartFixture: ScheduleMetricsChartSeriesData = {
  successfulRuns: [
    {
      scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 6 * HOUR_MS,
      runs: [
        {
          runId: '0192a1b2-c3d4-7000-8000-000000000001',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 6 * HOUR_MS,
          startedTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 6 * HOUR_MS + 1000,
          endedTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 5.5 * HOUR_MS,
        },
      ],
    },
    {
      scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 4 * HOUR_MS,
      runs: [
        {
          runId: '0192a1b2-c3d4-7000-8000-000000000002',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 4 * HOUR_MS,
          startedTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 4 * HOUR_MS + 500,
          endedTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 3.5 * HOUR_MS,
          backfillId: 'backfill-abc-123',
        },
        {
          runId: '0192a1b2-c3d4-7000-8000-000000000003',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
          scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 4 * HOUR_MS,
          startedTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 4 * HOUR_MS + 2000,
          endedTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 3.8 * HOUR_MS,
        },
      ],
    },
    {
      scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 1 * HOUR_MS,
      runs: [
        {
          runId: '0192a1b2-c3d4-7000-8000-000000000004',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 1 * HOUR_MS,
          startedTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 1 * HOUR_MS + 800,
          endedTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 0.5 * HOUR_MS,
        },
      ],
    },
  ],
  missedExecutions: [
    {
      scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 2 * HOUR_MS,
      runs: [
        {
          runId: '0192a1b2-c3d4-7000-8000-000000000005',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
          scheduledTimeMs: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS - 2 * HOUR_MS,
          startedTimeMs: null,
          endedTimeMs: null,
        },
      ],
    },
  ],
  nextExecutionTimeMs:
    SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS + 2 * HOUR_MS,
};
