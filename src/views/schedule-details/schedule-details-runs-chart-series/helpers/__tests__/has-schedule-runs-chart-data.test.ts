import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import hasScheduleRunsChartData from '../has-schedule-runs-chart-data';

describe(hasScheduleRunsChartData.name, () => {
  it('returns false when there are no runs, skips, unconfirmed slots, or next execution', () => {
    expect(
      hasScheduleRunsChartData({
        runs: [],
        skippedExecutions: [],
        unconfirmedExecutions: [],
        nextExecutionTimeMs: null,
      })
    ).toBe(false);
  });

  it('returns true when there is a run', () => {
    expect(
      hasScheduleRunsChartData({
        runs: [
          {
            runId: 'run-1',
            scheduledTimeMs: 1,
            status: WORKFLOW_STATUSES.completed,
          },
        ],
        skippedExecutions: [],
        unconfirmedExecutions: [],
        nextExecutionTimeMs: null,
      })
    ).toBe(true);
  });

  it('returns true when there is a skipped execution', () => {
    expect(
      hasScheduleRunsChartData({
        runs: [],
        skippedExecutions: [{ scheduledTimeMs: 1 }],
        unconfirmedExecutions: [],
        nextExecutionTimeMs: null,
      })
    ).toBe(true);
  });

  it('returns true when there is an unconfirmed execution', () => {
    expect(
      hasScheduleRunsChartData({
        runs: [],
        skippedExecutions: [],
        unconfirmedExecutions: [{ scheduledTimeMs: 1 }],
        nextExecutionTimeMs: null,
      })
    ).toBe(true);
  });

  it('returns true when there is a next execution', () => {
    expect(
      hasScheduleRunsChartData({
        runs: [],
        skippedExecutions: [],
        unconfirmedExecutions: [],
        nextExecutionTimeMs: 1,
      })
    ).toBe(true);
  });
});
