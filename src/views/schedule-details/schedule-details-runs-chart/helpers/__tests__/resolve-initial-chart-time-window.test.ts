import resolveInitialChartTimeWindow, {
  getReadableExpectedRunCount,
} from '../resolve-initial-chart-time-window';

const mockNowMs = new Date('2024-06-15T12:00:00Z').getTime();

describe(getReadableExpectedRunCount.name, () => {
  it('scales with the available chart width', () => {
    expect(getReadableExpectedRunCount(200)).toBeLessThan(
      getReadableExpectedRunCount(2000)
    );
  });

  it('never returns less than one', () => {
    expect(getReadableExpectedRunCount(0)).toBeGreaterThanOrEqual(1);
  });
});

describe(resolveInitialChartTimeWindow.name, () => {
  it('keeps now visible even with no run or expected data', () => {
    const window = resolveInitialChartTimeWindow({
      nowMs: mockNowMs,
      chartWidthPx: 800,
    });

    expect(window.minMs).toBeLessThanOrEqual(mockNowMs);
    expect(window.maxMs).toBeGreaterThanOrEqual(mockNowMs);
  });

  it('widens the window to include the oldest readable run', () => {
    const oldestRunMs = mockNowMs - 10 * 60 * 60_000;

    const window = resolveInitialChartTimeWindow({
      nowMs: mockNowMs,
      chartWidthPx: 800,
      timestampsMs: [oldestRunMs, mockNowMs - 60_000],
    });

    expect(window.minMs).toBeLessThanOrEqual(oldestRunMs);
  });

  it('widens the window to include the next expected execution', () => {
    const nextExecutionMs = mockNowMs + 4 * 60 * 60_000;

    const window = resolveInitialChartTimeWindow({
      nowMs: mockNowMs,
      chartWidthPx: 800,
      nextExecutionMs,
    });

    expect(window.maxMs).toBeGreaterThan(nextExecutionMs);
  });
});
