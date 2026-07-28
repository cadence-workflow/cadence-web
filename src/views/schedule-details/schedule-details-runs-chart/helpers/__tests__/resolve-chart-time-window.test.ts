import {
  CHART_DEFAULT_PAST_WINDOW_MS,
  CHART_FUTURE_GUTTER_MS,
  CHART_MIN_DOMAIN_SPAN_MS,
} from '../../schedule-details-runs-chart.constants';
import resolveChartTimeWindow from '../resolve-chart-time-window';

const mockNowMs = new Date('2024-06-15T12:00:00Z').getTime();

describe(resolveChartTimeWindow.name, () => {
  it('returns a default past window ending with future gutter when timestamps are empty', () => {
    const timeWindow = resolveChartTimeWindow({
      timestampsMs: [],
      nowMs: mockNowMs,
    });

    expect(timeWindow).toEqual({
      minMs: mockNowMs - CHART_DEFAULT_PAST_WINDOW_MS,
      maxMs: mockNowMs + CHART_FUTURE_GUTTER_MS,
    });
  });

  it('anchors on now when there are no runs yet but a next execution is known', () => {
    const nextExecutionMs = mockNowMs + 15 * 60_000;

    const timeWindow = resolveChartTimeWindow({
      timestampsMs: [],
      nowMs: mockNowMs,
      nextExecutionMs,
    });

    expect(timeWindow).toEqual({
      minMs: mockNowMs,
      maxMs: nextExecutionMs + CHART_FUTURE_GUTTER_MS,
    });
  });

  it('extends the window max using next execution plus future gutter', () => {
    const nextExecutionMs = mockNowMs + 15 * 60_000;

    const timeWindow = resolveChartTimeWindow({
      timestampsMs: [mockNowMs - 2 * 60 * 60_000],
      nowMs: mockNowMs,
      nextExecutionMs,
    });

    expect(timeWindow).toEqual({
      minMs: mockNowMs - 2 * 60 * 60_000,
      maxMs: nextExecutionMs + CHART_FUTURE_GUTTER_MS,
    });
  });

  it('uses cadence-derived gutter and clamps history to the navigation boundary', () => {
    const nextExecutionMs = mockNowMs + 60_000;

    expect(
      resolveChartTimeWindow({
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

  it('pads the window right of now even when all timestamps are in the past', () => {
    const timeWindow = resolveChartTimeWindow({
      timestampsMs: [mockNowMs - 3 * 60 * 60_000, mockNowMs - 60_000],
      nowMs: mockNowMs,
    });

    expect(timeWindow?.maxMs).toBe(mockNowMs + CHART_FUTURE_GUTTER_MS);
    expect(timeWindow?.minMs).toBe(mockNowMs - 3 * 60 * 60_000);
  });

  it('anchors a single timestamp at now and pads the future gutter to the right', () => {
    const timeWindow = resolveChartTimeWindow({
      timestampsMs: [mockNowMs],
      nowMs: mockNowMs,
    });

    expect(timeWindow).toEqual({
      minMs: mockNowMs,
      maxMs: mockNowMs + CHART_FUTURE_GUTTER_MS,
    });
  });

  it('expands a window narrower than the minimum span, centered on its midpoint', () => {
    const pointMs = mockNowMs - 60_000;

    const timeWindow = resolveChartTimeWindow({
      timestampsMs: [pointMs],
      nowMs: pointMs,
      futureGutterMs: 1_000,
    });

    expect(timeWindow!.maxMs - timeWindow!.minMs).toBe(
      CHART_MIN_DOMAIN_SPAN_MS
    );
    expect((timeWindow!.minMs + timeWindow!.maxMs) / 2).toBe(pointMs + 500);
  });

  it('returns null when nowMs is not finite', () => {
    expect(
      resolveChartTimeWindow({
        timestampsMs: [mockNowMs],
        nowMs: Number.NaN,
      })
    ).toBeNull();
  });

  it('normalizes an empty-data window pushed past maxMs by minimumTimeMs', () => {
    const timeWindow = resolveChartTimeWindow({
      timestampsMs: [],
      nowMs: mockNowMs,
      futureGutterMs: 60_000,
      minimumTimeMs: mockNowMs + 60_000,
    });

    expect(timeWindow!.maxMs).toBeGreaterThan(timeWindow!.minMs);
    expect(timeWindow!.maxMs - timeWindow!.minMs).toBeGreaterThanOrEqual(
      CHART_MIN_DOMAIN_SPAN_MS
    );
  });

  it('ignores non-finite timestamps', () => {
    const timeWindow = resolveChartTimeWindow({
      timestampsMs: [Number.NaN, mockNowMs - 60_000],
      nowMs: mockNowMs,
    });

    expect(timeWindow?.minMs).toBe(mockNowMs - 60_000);
    expect(timeWindow?.maxMs).toBe(mockNowMs + CHART_FUTURE_GUTTER_MS);
  });
});
