import filterChartPointsBeforeNextExecution from '../filter-chart-points-before-next-execution';

describe(filterChartPointsBeforeNextExecution.name, () => {
  it('drops points at or after the next execution', () => {
    const points = [
      { scheduledTimeMs: 1000 },
      { scheduledTimeMs: 2000 },
      { scheduledTimeMs: 3000 },
    ];

    expect(filterChartPointsBeforeNextExecution(points, 2000)).toEqual([
      { scheduledTimeMs: 1000 },
    ]);
  });

  it('returns all points when there is no next execution', () => {
    const points = [{ scheduledTimeMs: 1000 }];

    expect(filterChartPointsBeforeNextExecution(points, null)).toEqual(points);
  });
});
