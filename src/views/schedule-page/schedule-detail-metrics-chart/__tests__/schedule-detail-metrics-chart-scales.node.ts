import {
  createMetricsChartXScale,
  pixelToTimeMs,
  resolveMetricsChartPixelRange,
  resolveMetricsChartTimeDomain,
  timeMsToPixel,
} from '../schedule-detail-metrics-chart-scales';
import {
  CHART_DEFAULT_PAST_WINDOW_MS,
  CHART_FUTURE_GUTTER_MS,
  CHART_MIN_DOMAIN_SPAN_MS,
  CHART_SIDE_PADDING_PX,
} from '../schedule-detail-metrics-chart.constants';

const mockNowMs = new Date('2024-06-15T12:00:00Z').getTime();

describe(resolveMetricsChartTimeDomain.name, () => {
  it('returns a default past window ending with future gutter when timestamps are empty', () => {
    const domain = resolveMetricsChartTimeDomain({
      timestampsMs: [],
      nowMs: mockNowMs,
    });

    expect(domain).toEqual({
      minMs: mockNowMs - CHART_DEFAULT_PAST_WINDOW_MS,
      maxMs: mockNowMs + CHART_FUTURE_GUTTER_MS,
    });
  });

  it('extends the domain max using next execution plus future gutter', () => {
    const nextExecutionMs = mockNowMs + 15 * 60_000;

    const domain = resolveMetricsChartTimeDomain({
      timestampsMs: [mockNowMs - 2 * 60 * 60_000],
      nowMs: mockNowMs,
      nextExecutionMs,
    });

    expect(domain).toEqual({
      minMs: mockNowMs - 2 * 60 * 60_000,
      maxMs: nextExecutionMs + CHART_FUTURE_GUTTER_MS,
    });
  });

  it('pads the domain right of now even when all timestamps are in the past', () => {
    const domain = resolveMetricsChartTimeDomain({
      timestampsMs: [mockNowMs - 3 * 60 * 60_000, mockNowMs - 60_000],
      nowMs: mockNowMs,
    });

    expect(domain?.maxMs).toBe(mockNowMs + CHART_FUTURE_GUTTER_MS);
    expect(domain?.minMs).toBe(mockNowMs - 3 * 60 * 60_000);
  });

  it('anchors a single timestamp at now and pads the future gutter to the right', () => {
    const domain = resolveMetricsChartTimeDomain({
      timestampsMs: [mockNowMs],
      nowMs: mockNowMs,
    });

    expect(domain).toEqual({
      minMs: mockNowMs,
      maxMs: mockNowMs + CHART_FUTURE_GUTTER_MS,
    });
  });

  it('expands a collapsed domain to the minimum span when span would otherwise be zero', () => {
    const pointMs = mockNowMs - 60_000;

    const domain = resolveMetricsChartTimeDomain({
      timestampsMs: [pointMs, pointMs],
      nowMs: pointMs,
      nextExecutionMs: pointMs,
    });

    expect(domain?.maxMs! - domain?.minMs!).toBeGreaterThanOrEqual(
      CHART_MIN_DOMAIN_SPAN_MS
    );
  });

  it('returns null when nowMs is not finite', () => {
    expect(
      resolveMetricsChartTimeDomain({
        timestampsMs: [mockNowMs],
        nowMs: Number.NaN,
      })
    ).toBeNull();
  });

  it('ignores non-finite timestamps', () => {
    const domain = resolveMetricsChartTimeDomain({
      timestampsMs: [Number.NaN, mockNowMs - 60_000],
      nowMs: mockNowMs,
    });

    expect(domain?.minMs).toBe(mockNowMs - 60_000);
    expect(domain?.maxMs).toBe(mockNowMs + CHART_FUTURE_GUTTER_MS);
  });
});

describe(resolveMetricsChartPixelRange.name, () => {
  it('maps chart width to a padded drawable pixel range', () => {
    expect(
      resolveMetricsChartPixelRange({
        widthPx: 800,
        sidePaddingPx: CHART_SIDE_PADDING_PX,
      })
    ).toEqual({
      startPx: CHART_SIDE_PADDING_PX,
      endPx: 800 - CHART_SIDE_PADDING_PX,
    });
  });

  it('returns null when width is zero or negative', () => {
    expect(resolveMetricsChartPixelRange({ widthPx: 0 })).toBeNull();
    expect(resolveMetricsChartPixelRange({ widthPx: -10 })).toBeNull();
  });

  it('returns null when side padding consumes the full width', () => {
    expect(
      resolveMetricsChartPixelRange({
        widthPx: CHART_SIDE_PADDING_PX * 2,
        sidePaddingPx: CHART_SIDE_PADDING_PX,
      })
    ).toBeNull();
  });
});

describe('metrics chart x scale', () => {
  const domain = {
    minMs: mockNowMs - 60 * 60_000,
    maxMs: mockNowMs + CHART_FUTURE_GUTTER_MS,
  };
  const range = {
    startPx: CHART_SIDE_PADDING_PX,
    endPx: 776,
  };

  it('maps domain endpoints to pixel range', () => {
    const scale = createMetricsChartXScale({ domain, range });

    expect(scale).not.toBeNull();
    expect(timeMsToPixel(domain.minMs, scale!)).toBe(range.startPx);
    expect(timeMsToPixel(domain.maxMs, scale!)).toBe(range.endPx);
    expect(timeMsToPixel(mockNowMs, scale!)).toBeGreaterThan(range.startPx);
    expect(timeMsToPixel(mockNowMs, scale!)).toBeLessThan(range.endPx);
  });

  it('inverts pixel positions back to timestamps', () => {
    const scale = createMetricsChartXScale({ domain, range })!;

    expect(pixelToTimeMs(range.startPx, scale)).toBe(domain.minMs);
    expect(pixelToTimeMs(range.endPx, scale)).toBe(domain.maxMs);
  });

  it('returns null for invalid domain or range', () => {
    expect(
      createMetricsChartXScale({
        domain: { minMs: mockNowMs, maxMs: mockNowMs },
        range,
      })
    ).toBeNull();

    expect(
      createMetricsChartXScale({
        domain,
        range: { startPx: 100, endPx: 100 },
      })
    ).toBeNull();
  });
});
