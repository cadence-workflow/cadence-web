import {
  createRunsChartXScale,
  resolveRunsChartPixelRange,
  resolveRunsChartTimeDomain,
} from '../schedule-details-runs-chart-scales';
import {
  CHART_DEFAULT_PAST_WINDOW_MS,
  CHART_FUTURE_GUTTER_MS,
  CHART_MIN_DOMAIN_SPAN_MS,
  CHART_SIDE_PADDING_PX,
} from '../schedule-details-runs-chart.constants';

const mockNowMs = new Date('2024-06-15T12:00:00Z').getTime();

describe(resolveRunsChartTimeDomain.name, () => {
  it('returns a default past window ending with future gutter when timestamps are empty', () => {
    const domain = resolveRunsChartTimeDomain({
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

    const domain = resolveRunsChartTimeDomain({
      timestampsMs: [mockNowMs - 2 * 60 * 60_000],
      nowMs: mockNowMs,
      nextExecutionMs,
    });

    expect(domain).toEqual({
      minMs: mockNowMs - 2 * 60 * 60_000,
      maxMs: nextExecutionMs + CHART_FUTURE_GUTTER_MS,
    });
  });

  it('uses cadence-derived gutter and clamps history to the navigation boundary', () => {
    const nextExecutionMs = mockNowMs + 60_000;

    expect(
      resolveRunsChartTimeDomain({
        timestampsMs: [mockNowMs - 4 * 60 * 60_000],
        nowMs: mockNowMs,
        nextExecutionMs,
        futureGutterMs: 60_000,
        minimumTimeMs: mockNowMs - 2 * 60 * 60_000,
      })
    ).toEqual({
      minMs: mockNowMs - 2 * 60 * 60_000,
      maxMs: nextExecutionMs + 60_000,
    });
  });

  it('pads the domain right of now even when all timestamps are in the past', () => {
    const domain = resolveRunsChartTimeDomain({
      timestampsMs: [mockNowMs - 3 * 60 * 60_000, mockNowMs - 60_000],
      nowMs: mockNowMs,
    });

    expect(domain?.maxMs).toBe(mockNowMs + CHART_FUTURE_GUTTER_MS);
    expect(domain?.minMs).toBe(mockNowMs - 3 * 60 * 60_000);
  });

  it('anchors a single timestamp at now and pads the future gutter to the right', () => {
    const domain = resolveRunsChartTimeDomain({
      timestampsMs: [mockNowMs],
      nowMs: mockNowMs,
    });

    expect(domain).toEqual({
      minMs: mockNowMs,
      maxMs: mockNowMs + CHART_FUTURE_GUTTER_MS,
    });
  });

  it('expands a collapsed domain to the minimum span', () => {
    const pointMs = mockNowMs - 60_000;

    const domain = resolveRunsChartTimeDomain({
      timestampsMs: [pointMs, pointMs],
      nowMs: pointMs,
      nextExecutionMs: pointMs,
    });

    expect(domain!.maxMs - domain!.minMs).toBeGreaterThanOrEqual(
      CHART_MIN_DOMAIN_SPAN_MS
    );
  });

  it('returns null when nowMs is not finite', () => {
    expect(
      resolveRunsChartTimeDomain({
        timestampsMs: [mockNowMs],
        nowMs: Number.NaN,
      })
    ).toBeNull();
  });

  it('normalizes an empty-data domain pushed past maxMs by minimumTimeMs', () => {
    const domain = resolveRunsChartTimeDomain({
      timestampsMs: [],
      nowMs: mockNowMs,
      futureGutterMs: 60_000,
      minimumTimeMs: mockNowMs + 60_000,
    });

    expect(domain!.maxMs).toBeGreaterThan(domain!.minMs);
    expect(domain!.maxMs - domain!.minMs).toBeGreaterThanOrEqual(
      CHART_MIN_DOMAIN_SPAN_MS
    );
  });

  it('ignores non-finite timestamps', () => {
    const domain = resolveRunsChartTimeDomain({
      timestampsMs: [Number.NaN, mockNowMs - 60_000],
      nowMs: mockNowMs,
    });

    expect(domain?.minMs).toBe(mockNowMs - 60_000);
    expect(domain?.maxMs).toBe(mockNowMs + CHART_FUTURE_GUTTER_MS);
  });
});

describe(resolveRunsChartPixelRange.name, () => {
  it('maps chart width to a padded drawable pixel range', () => {
    expect(
      resolveRunsChartPixelRange({
        widthPx: 800,
        sidePaddingPx: CHART_SIDE_PADDING_PX,
      })
    ).toEqual({
      startPx: CHART_SIDE_PADDING_PX,
      endPx: 800 - CHART_SIDE_PADDING_PX,
    });
  });

  it('returns null when width is zero or negative', () => {
    expect(resolveRunsChartPixelRange({ widthPx: 0 })).toBeNull();
    expect(resolveRunsChartPixelRange({ widthPx: -10 })).toBeNull();
  });

  it('returns null when side padding consumes the full width', () => {
    expect(
      resolveRunsChartPixelRange({
        widthPx: CHART_SIDE_PADDING_PX * 2,
        sidePaddingPx: CHART_SIDE_PADDING_PX,
      })
    ).toBeNull();
  });
});

describe(createRunsChartXScale.name, () => {
  const domain = {
    minMs: mockNowMs - 60 * 60_000,
    maxMs: mockNowMs + CHART_FUTURE_GUTTER_MS,
  };
  const range = {
    startPx: CHART_SIDE_PADDING_PX,
    endPx: 776,
  };

  it('maps domain endpoints to the pixel range', () => {
    const scale = createRunsChartXScale({ domain, range })!;

    expect(scale(domain.minMs)).toBe(range.startPx);
    expect(scale(domain.maxMs)).toBe(range.endPx);
    expect(scale(mockNowMs)).toBeGreaterThan(range.startPx);
    expect(scale(mockNowMs)).toBeLessThan(range.endPx);
  });

  it('inverts pixel positions back to timestamps', () => {
    const scale = createRunsChartXScale({ domain, range })!;

    expect(scale.invert(range.startPx)).toBe(domain.minMs);
    expect(scale.invert(range.endPx)).toBe(domain.maxMs);
  });

  it('returns null for an invalid domain or range', () => {
    expect(
      createRunsChartXScale({
        domain: { minMs: mockNowMs, maxMs: mockNowMs },
        range,
      })
    ).toBeNull();

    expect(
      createRunsChartXScale({
        domain,
        range: { startPx: 100, endPx: 100 },
      })
    ).toBeNull();
  });
});
