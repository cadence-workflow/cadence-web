import {
  CHART_MIN_DOMAIN_SPAN_MS,
  CHART_NOW_ANCHOR_RATIO,
  CHART_ZOOM_IN_FACTOR,
  CHART_ZOOM_OUT_FACTOR,
} from '../schedule-detail-metrics-chart.constants';
import { type MetricsChartTimeDomain } from '../schedule-detail-metrics-chart.types';

export type MetricsChartViewState = {
  visibleDomain: MetricsChartTimeDomain;
  fitAllDomain: MetricsChartTimeDomain;
};

export type ZoomMetricsChartDomainParams = {
  visibleDomain: MetricsChartTimeDomain;
  fitAllDomain: MetricsChartTimeDomain;
  factor: number;
  anchorMs: number;
};

export type PanMetricsChartDomainToTimeParams = {
  visibleDomain: MetricsChartTimeDomain;
  fitAllDomain: MetricsChartTimeDomain;
  timeMs: number;
  anchorRatio?: number;
};

function getDomainSpanMs(domain: MetricsChartTimeDomain): number {
  return domain.maxMs - domain.minMs;
}

function getDomainCenterMs(domain: MetricsChartTimeDomain): number {
  return (domain.minMs + domain.maxMs) / 2;
}

function expandDomainToMinSpan(domain: MetricsChartTimeDomain): MetricsChartTimeDomain {
  const spanMs = getDomainSpanMs(domain);

  if (spanMs >= CHART_MIN_DOMAIN_SPAN_MS) {
    return domain;
  }

  const centerMs = getDomainCenterMs(domain);

  return {
    minMs: centerMs - CHART_MIN_DOMAIN_SPAN_MS / 2,
    maxMs: centerMs + CHART_MIN_DOMAIN_SPAN_MS / 2,
  };
}

export function clampMetricsChartVisibleDomain(
  visibleDomain: MetricsChartTimeDomain,
  fitAllDomain: MetricsChartTimeDomain
): MetricsChartTimeDomain {
  const visibleSpanMs = getDomainSpanMs(visibleDomain);
  const fitAllSpanMs = getDomainSpanMs(fitAllDomain);

  if (visibleSpanMs >= fitAllSpanMs) {
    return fitAllDomain;
  }

  let minMs = Math.max(visibleDomain.minMs, fitAllDomain.minMs);
  let maxMs = minMs + visibleSpanMs;

  if (maxMs > fitAllDomain.maxMs) {
    maxMs = fitAllDomain.maxMs;
    minMs = maxMs - visibleSpanMs;
  }

  return expandDomainToMinSpan({ minMs, maxMs });
}

export function zoomMetricsChartDomain({
  visibleDomain,
  fitAllDomain,
  factor,
  anchorMs,
}: ZoomMetricsChartDomainParams): MetricsChartTimeDomain {
  const currentSpanMs = getDomainSpanMs(visibleDomain);
  const nextSpanMs = currentSpanMs * factor;
  const anchorRatio = (anchorMs - visibleDomain.minMs) / currentSpanMs;
  const clampedAnchorRatio = Number.isFinite(anchorRatio)
    ? Math.min(Math.max(anchorRatio, 0), 1)
    : 0.5;

  const zoomedDomain = expandDomainToMinSpan({
    minMs: anchorMs - nextSpanMs * clampedAnchorRatio,
    maxMs: anchorMs + nextSpanMs * (1 - clampedAnchorRatio),
  });

  return clampMetricsChartVisibleDomain(zoomedDomain, fitAllDomain);
}

export function panMetricsChartDomainToTime({
  visibleDomain,
  fitAllDomain,
  timeMs,
  anchorRatio = CHART_NOW_ANCHOR_RATIO,
}: PanMetricsChartDomainToTimeParams): MetricsChartTimeDomain {
  const visibleSpanMs = getDomainSpanMs(visibleDomain);
  const clampedAnchorRatio = Math.min(Math.max(anchorRatio, 0), 1);
  const pannedDomain = {
    minMs: timeMs - visibleSpanMs * clampedAnchorRatio,
    maxMs: timeMs + visibleSpanMs * (1 - clampedAnchorRatio),
  };

  return clampMetricsChartVisibleDomain(pannedDomain, fitAllDomain);
}

export function canZoomMetricsChartIn(
  visibleDomain: MetricsChartTimeDomain
): boolean {
  return getDomainSpanMs(visibleDomain) > CHART_MIN_DOMAIN_SPAN_MS;
}

export function canZoomMetricsChartOut(
  visibleDomain: MetricsChartTimeDomain,
  fitAllDomain: MetricsChartTimeDomain
): boolean {
  return getDomainSpanMs(visibleDomain) < getDomainSpanMs(fitAllDomain);
}

export function isMetricsChartFitAllView(
  visibleDomain: MetricsChartTimeDomain,
  fitAllDomain: MetricsChartTimeDomain
): boolean {
  return (
    visibleDomain.minMs === fitAllDomain.minMs &&
    visibleDomain.maxMs === fitAllDomain.maxMs
  );
}

export function createMetricsChartZoomInAction(
  state: MetricsChartViewState,
  anchorMs: number
): MetricsChartTimeDomain {
  return zoomMetricsChartDomain({
    visibleDomain: state.visibleDomain,
    fitAllDomain: state.fitAllDomain,
    factor: CHART_ZOOM_IN_FACTOR,
    anchorMs,
  });
}

export function createMetricsChartZoomOutAction(
  state: MetricsChartViewState,
  anchorMs: number
): MetricsChartTimeDomain {
  return zoomMetricsChartDomain({
    visibleDomain: state.visibleDomain,
    fitAllDomain: state.fitAllDomain,
    factor: CHART_ZOOM_OUT_FACTOR,
    anchorMs,
  });
}
