import {
  CHART_MIN_DOMAIN_SPAN_MS,
  CHART_NOW_ANCHOR_RATIO,
  CHART_ZOOM_IN_FACTOR,
} from '../schedule-detail-metrics-chart.constants';
import {
  canZoomMetricsChartIn,
  canZoomMetricsChartOut,
  clampMetricsChartVisibleDomain,
  createMetricsChartZoomInAction,
  isMetricsChartFitAllView,
  panMetricsChartDomainToTime,
  zoomMetricsChartDomain,
} from '../helpers/schedule-detail-metrics-chart-view-state';

const mockNowMs = new Date('2024-06-15T12:00:00Z').getTime();
const fitAllDomain = {
  minMs: mockNowMs - 6 * 60 * 60 * 1000,
  maxMs: mockNowMs + 2.5 * 60 * 60 * 1000,
};

describe(clampMetricsChartVisibleDomain.name, () => {
  it('returns fitAll when visible span exceeds fitAll span', () => {
    expect(
      clampMetricsChartVisibleDomain(
        {
          minMs: fitAllDomain.minMs - 60_000,
          maxMs: fitAllDomain.maxMs + 60_000,
        },
        fitAllDomain
      )
    ).toEqual(fitAllDomain);
  });

  it('slides the visible window when panning past fitAll max', () => {
    const visibleSpanMs = fitAllDomain.maxMs - fitAllDomain.minMs;

    expect(
      clampMetricsChartVisibleDomain(
        {
          minMs: fitAllDomain.maxMs - visibleSpanMs / 2,
          maxMs: fitAllDomain.maxMs + visibleSpanMs / 2,
        },
        fitAllDomain
      )
    ).toEqual({
      minMs: fitAllDomain.maxMs - visibleSpanMs,
      maxMs: fitAllDomain.maxMs,
    });
  });
});

describe(zoomMetricsChartDomain.name, () => {
  it('narrows the visible domain around the anchor time', () => {
    const fitAllSpanMs = fitAllDomain.maxMs - fitAllDomain.minMs;

    const zoomedDomain = zoomMetricsChartDomain({
      visibleDomain: fitAllDomain,
      fitAllDomain,
      factor: CHART_ZOOM_IN_FACTOR,
      anchorMs: mockNowMs,
    });

    expect(zoomedDomain.maxMs - zoomedDomain.minMs).toBeCloseTo(
      fitAllSpanMs * CHART_ZOOM_IN_FACTOR,
      -2
    );
    expect(zoomedDomain.minMs).toBeLessThan(mockNowMs);
    expect(zoomedDomain.maxMs).toBeGreaterThan(mockNowMs);
  });
});

describe(panMetricsChartDomainToTime.name, () => {
  it('anchors now near the right edge of the visible window', () => {
    const visibleDomain = createMetricsChartZoomInAction(
      { visibleDomain: fitAllDomain, fitAllDomain },
      mockNowMs - 2 * 60 * 60 * 1000
    );
    const pannedDomain = panMetricsChartDomainToTime({
      visibleDomain,
      fitAllDomain,
      timeMs: mockNowMs,
    });
    const spanMs = pannedDomain.maxMs - pannedDomain.minMs;
    const nowOffsetMs = mockNowMs - pannedDomain.minMs;

    expect(nowOffsetMs / spanMs).toBeCloseTo(CHART_NOW_ANCHOR_RATIO, 5);
    expect(pannedDomain.minMs).toBeGreaterThanOrEqual(fitAllDomain.minMs);
    expect(pannedDomain.maxMs).toBeLessThanOrEqual(fitAllDomain.maxMs);
  });
});

describe('metrics chart view control guards', () => {
  it('detects when further zoom in is blocked by the minimum span', () => {
    const minSpanDomain = {
      minMs: mockNowMs - CHART_MIN_DOMAIN_SPAN_MS / 2,
      maxMs: mockNowMs + CHART_MIN_DOMAIN_SPAN_MS / 2,
    };

    expect(canZoomMetricsChartIn(minSpanDomain)).toBe(false);
    expect(canZoomMetricsChartOut(minSpanDomain, fitAllDomain)).toBe(true);
    expect(isMetricsChartFitAllView(fitAllDomain, fitAllDomain)).toBe(true);
  });
});
