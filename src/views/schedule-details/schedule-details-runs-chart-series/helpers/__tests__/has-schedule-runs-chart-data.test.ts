import hasScheduleRunsChartData from '../has-schedule-runs-chart-data';

describe(hasScheduleRunsChartData.name, () => {
  it('returns false when there are no runs, misses, or next execution', () => {
    expect(
      hasScheduleRunsChartData({
        successfulRuns: [],
        missedExecutions: [],
        nextExecutionTimeMs: null,
      })
    ).toBe(false);
  });

  it('returns true when there is a successful run', () => {
    expect(
      hasScheduleRunsChartData({
        successfulRuns: [{ scheduledTimeMs: 1 }],
        missedExecutions: [],
        nextExecutionTimeMs: null,
      })
    ).toBe(true);
  });

  it('returns true when there is a missed execution', () => {
    expect(
      hasScheduleRunsChartData({
        successfulRuns: [],
        missedExecutions: [{ scheduledTimeMs: 1 }],
        nextExecutionTimeMs: null,
      })
    ).toBe(true);
  });

  it('returns true when there is a next execution', () => {
    expect(
      hasScheduleRunsChartData({
        successfulRuns: [],
        missedExecutions: [],
        nextExecutionTimeMs: 1,
      })
    ).toBe(true);
  });
});
