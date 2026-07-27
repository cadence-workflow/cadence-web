import {
  canZoomMetricsChartIn,
  canZoomMetricsChartOut,
  clampMetricsChartVisibleDomain,
  panMetricsChartDomainToTime,
  resolveMetricsChartFollowDomain,
  zoomMetricsChartDomain,
} from '../helpers/schedule-detail-metrics-chart-view-state';
import {
  CHART_MIN_DOMAIN_SPAN_MS,
  CHART_NOW_ANCHOR_RATIO,
  CHART_ZOOM_IN_FACTOR,
  CHART_ZOOM_OUT_FACTOR,
} from '../schedule-detail-metrics-chart.constants';

const mockNowMs = new Date('2024-06-15T12:00:00Z').getTime();
const bounds = {
  minMs: mockNowMs - 6 * 60 * 60 * 1000,
  maxMs: mockNowMs + 2.5 * 60 * 60 * 1000,
};
const maxSpanMs = 4 * 60 * 60 * 1000;

describe(clampMetricsChartVisibleDomain.name, () => {
  it('returns the navigation bounds when the visible span exceeds them', () => {
    expect(
      clampMetricsChartVisibleDomain(
        { minMs: bounds.minMs - 60_000, maxMs: bounds.maxMs + 60_000 },
        bounds
      )
    ).toEqual(bounds);
  });

  it('slides the visible window when panning past the bounds max', () => {
    const visibleSpanMs = bounds.maxMs - bounds.minMs;

    expect(
      clampMetricsChartVisibleDomain(
        {
          minMs: bounds.maxMs - visibleSpanMs / 2,
          maxMs: bounds.maxMs + visibleSpanMs / 2,
        },
        bounds
      )
    ).toEqual({
      minMs: bounds.maxMs - visibleSpanMs,
      maxMs: bounds.maxMs,
    });
  });
});

describe(zoomMetricsChartDomain.name, () => {
  it('narrows the visible domain around the anchor time', () => {
    const visibleDomain = {
      minMs: mockNowMs - 3 * 60 * 60 * 1000,
      maxMs: mockNowMs + 60 * 60 * 1000,
    };

    const zoomedDomain = zoomMetricsChartDomain({
      visibleDomain,
      bounds,
      maxSpanMs,
      factor: CHART_ZOOM_IN_FACTOR,
      anchorMs: mockNowMs,
    });

    expect(zoomedDomain.maxMs - zoomedDomain.minMs).toBeCloseTo(
      (visibleDomain.maxMs - visibleDomain.minMs) * CHART_ZOOM_IN_FACTOR,
      -2
    );
    expect(zoomedDomain.minMs).toBeLessThan(mockNowMs);
    expect(zoomedDomain.maxMs).toBeGreaterThan(mockNowMs);
  });

  it('keeps historical zoom centered instead of jumping to now', () => {
    const historicalDomain = {
      minMs: mockNowMs - 5 * 60 * 60 * 1000,
      maxMs: mockNowMs - 3 * 60 * 60 * 1000,
    };

    expect(
      zoomMetricsChartDomain({
        visibleDomain: historicalDomain,
        bounds,
        maxSpanMs,
        factor: CHART_ZOOM_IN_FACTOR,
        anchorMs: mockNowMs,
      })
    ).toEqual({
      minMs: mockNowMs - 4.5 * 60 * 60 * 1000,
      maxMs: mockNowMs - 3.5 * 60 * 60 * 1000,
    });
  });

  it('never zooms out past the readable maximum span', () => {
    const visibleDomain = {
      minMs: mockNowMs - maxSpanMs * 0.75,
      maxMs: mockNowMs + maxSpanMs * 0.25,
    };

    const zoomedDomain = zoomMetricsChartDomain({
      visibleDomain,
      bounds,
      maxSpanMs,
      factor: CHART_ZOOM_OUT_FACTOR,
      anchorMs: mockNowMs,
    });

    expect(zoomedDomain.maxMs - zoomedDomain.minMs).toBeCloseTo(maxSpanMs, -2);
  });
});

describe(panMetricsChartDomainToTime.name, () => {
  it('anchors now near the right edge of the visible window', () => {
    const visibleDomain = {
      minMs: mockNowMs - 4 * 60 * 60 * 1000,
      maxMs: mockNowMs - 2 * 60 * 60 * 1000,
    };
    const pannedDomain = panMetricsChartDomainToTime({
      visibleDomain,
      bounds,
      timeMs: mockNowMs,
    });
    const spanMs = pannedDomain.maxMs - pannedDomain.minMs;

    expect((mockNowMs - pannedDomain.minMs) / spanMs).toBeCloseTo(
      CHART_NOW_ANCHOR_RATIO,
      5
    );
    expect(pannedDomain.minMs).toBeGreaterThanOrEqual(bounds.minMs);
    expect(pannedDomain.maxMs).toBeLessThanOrEqual(bounds.maxMs);
  });
});

describe(resolveMetricsChartFollowDomain.name, () => {
  it('anchors now when the next run already fits in view', () => {
    const spanMs = 4 * 60 * 60 * 1000;
    const visibleDomain = {
      minMs: mockNowMs - spanMs * CHART_NOW_ANCHOR_RATIO,
      maxMs: mockNowMs + spanMs * (1 - CHART_NOW_ANCHOR_RATIO),
    };

    const followDomain = resolveMetricsChartFollowDomain({
      visibleDomain,
      bounds,
      nowMs: mockNowMs + 1_000,
      nextExecutionMs: mockNowMs + 10 * 60_000,
    });

    expect(followDomain).toEqual({
      minMs: visibleDomain.minMs + 1_000,
      maxMs: visibleDomain.maxMs + 1_000,
    });
  });

  it('pulls a next run that falls outside the anchored window into view', () => {
    const spanMs = 2 * 60 * 60 * 1000;
    const visibleDomain = {
      minMs: mockNowMs - spanMs * CHART_NOW_ANCHOR_RATIO,
      maxMs: mockNowMs + spanMs * (1 - CHART_NOW_ANCHOR_RATIO),
    };
    const nextExecutionMs = mockNowMs + 60 * 60 * 1000;

    const followDomain = resolveMetricsChartFollowDomain({
      visibleDomain,
      bounds,
      nowMs: mockNowMs,
      nextExecutionMs,
    });

    expect(followDomain.maxMs).toBeGreaterThan(nextExecutionMs);
    expect(followDomain.minMs).toBeLessThanOrEqual(mockNowMs);
    expect(followDomain.maxMs - followDomain.minMs).toBeCloseTo(spanMs, -2);
  });

  it('keeps now visible when the next run cannot fit in the zoomed span', () => {
    const spanMs = 10 * 60_000;
    const visibleDomain = {
      minMs: mockNowMs - spanMs * CHART_NOW_ANCHOR_RATIO,
      maxMs: mockNowMs + spanMs * (1 - CHART_NOW_ANCHOR_RATIO),
    };

    const followDomain = resolveMetricsChartFollowDomain({
      visibleDomain,
      bounds,
      nowMs: mockNowMs,
      nextExecutionMs: mockNowMs + 2 * 60 * 60 * 1000,
    });

    expect(followDomain.minMs).toBeLessThan(mockNowMs);
    expect(followDomain.maxMs).toBeGreaterThan(mockNowMs);
  });
});

describe('metrics chart view control guards', () => {
  it('detects when further zoom is blocked by the span limits', () => {
    const minSpanDomain = {
      minMs: mockNowMs - CHART_MIN_DOMAIN_SPAN_MS / 2,
      maxMs: mockNowMs + CHART_MIN_DOMAIN_SPAN_MS / 2,
    };
    const maxSpanDomain = {
      minMs: mockNowMs - maxSpanMs,
      maxMs: mockNowMs,
    };

    expect(canZoomMetricsChartIn(minSpanDomain)).toBe(false);
    expect(canZoomMetricsChartOut(minSpanDomain, maxSpanMs)).toBe(true);
    expect(canZoomMetricsChartOut(maxSpanDomain, maxSpanMs)).toBe(false);
  });
});
