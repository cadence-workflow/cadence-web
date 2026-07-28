import groupChartSeriesRuns from '../group-chart-series-runs';

describe(groupChartSeriesRuns.name, () => {
  it('returns an empty array for no runs', () => {
    expect(groupChartSeriesRuns([])).toEqual([]);
  });

  it('returns one group per distinct scheduled time', () => {
    const runs = [
      { runId: 'run-1', scheduledTimeMs: 1, status: 'completed' as const },
      { runId: 'run-2', scheduledTimeMs: 2, status: 'failed' as const },
    ];

    expect(groupChartSeriesRuns(runs)).toEqual([
      { scheduledTimeMs: 1, runs: [runs[0]] },
      { scheduledTimeMs: 2, runs: [runs[1]] },
    ]);
  });

  it('groups runs that share a scheduled time, preserving order', () => {
    const runs = [
      { runId: 'run-1', scheduledTimeMs: 1, status: 'completed' as const },
      { runId: 'run-2', scheduledTimeMs: 1, status: 'failed' as const },
    ];

    expect(groupChartSeriesRuns(runs)).toEqual([{ scheduledTimeMs: 1, runs }]);
  });
});
