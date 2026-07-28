import hasScheduleRunsChartData from '../has-schedule-runs-chart-data';

describe(hasScheduleRunsChartData.name, () => {
  it('returns false when there are no runs, skips, or next execution', () => {
    expect(
      hasScheduleRunsChartData({
        runs: [],
        skippedExecutions: [],
        nextExecutionTimeMs: null,
      })
    ).toBe(false);
  });

  it('returns true when there is a run', () => {
    expect(
      hasScheduleRunsChartData({
        runs: [{ runId: 'run-1', scheduledTimeMs: 1, status: 'completed' }],
        skippedExecutions: [],
        nextExecutionTimeMs: null,
      })
    ).toBe(true);
  });

  it('returns true when there is a skipped execution', () => {
    expect(
      hasScheduleRunsChartData({
        runs: [],
        skippedExecutions: [{ scheduledTimeMs: 1 }],
        nextExecutionTimeMs: null,
      })
    ).toBe(true);
  });

  it('returns true when there is a next execution', () => {
    expect(
      hasScheduleRunsChartData({
        runs: [],
        skippedExecutions: [],
        nextExecutionTimeMs: 1,
      })
    ).toBe(true);
  });
});
