import {
  CHART_FUTURE_GUTTER_MS,
  CHART_SIDE_PADDING_PX,
} from '../../schedule-details-runs-chart.constants';
import createChartXScale from '../create-chart-x-scale';

const mockNowMs = new Date('2024-06-15T12:00:00Z').getTime();

describe(createChartXScale.name, () => {
  const timeWindow = {
    minMs: mockNowMs - 60 * 60_000,
    maxMs: mockNowMs + CHART_FUTURE_GUTTER_MS,
  };
  const range = {
    startPx: CHART_SIDE_PADDING_PX,
    endPx: 776,
  };

  it('maps time window endpoints to the pixel range', () => {
    const scale = createChartXScale({ timeWindow, range })!;

    expect(scale(timeWindow.minMs)).toBe(range.startPx);
    expect(scale(timeWindow.maxMs)).toBe(range.endPx);
    expect(scale(mockNowMs)).toBeGreaterThan(range.startPx);
    expect(scale(mockNowMs)).toBeLessThan(range.endPx);
  });

  it('inverts pixel positions back to timestamps', () => {
    const scale = createChartXScale({ timeWindow, range })!;

    expect(scale.invert(range.startPx)).toBe(timeWindow.minMs);
    expect(scale.invert(range.endPx)).toBe(timeWindow.maxMs);
  });

  it('returns null for an invalid time window or range', () => {
    expect(
      createChartXScale({
        timeWindow: { minMs: mockNowMs, maxMs: mockNowMs },
        range,
      })
    ).toBeNull();

    expect(
      createChartXScale({
        timeWindow,
        range: { startPx: 100, endPx: 100 },
      })
    ).toBeNull();
  });
});
