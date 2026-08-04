import shiftChartTimeWindow from '../shift-chart-time-window';

describe(shiftChartTimeWindow.name, () => {
  it('shifts both bounds by deltaMs when unbounded', () => {
    expect(
      shiftChartTimeWindow({
        visibleWindow: { minMs: 10_000, maxMs: 20_000 },
        deltaMs: -5_000,
      })
    ).toEqual({ minMs: 5_000, maxMs: 15_000 });
  });

  it('clamps the shift to the lower bound, preserving span', () => {
    expect(
      shiftChartTimeWindow({
        visibleWindow: { minMs: 10_000, maxMs: 20_000 },
        deltaMs: -50_000,
        bounds: { minMs: 0, maxMs: 100_000 },
      })
    ).toEqual({ minMs: 0, maxMs: 10_000 });
  });

  it('clamps the shift to the upper bound, preserving span', () => {
    expect(
      shiftChartTimeWindow({
        visibleWindow: { minMs: 10_000, maxMs: 20_000 },
        deltaMs: 500_000,
        bounds: { minMs: 0, maxMs: 100_000 },
      })
    ).toEqual({ minMs: 90_000, maxMs: 100_000 });
  });
});
