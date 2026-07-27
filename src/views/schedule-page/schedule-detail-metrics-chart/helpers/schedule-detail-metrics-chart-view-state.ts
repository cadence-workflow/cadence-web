import {
  CHART_MIN_DOMAIN_SPAN_MS,
  CHART_NEXT_RUN_ANCHOR_RATIO,
  CHART_NOW_ANCHOR_RATIO,
} from '../schedule-detail-metrics-chart.constants';
import { type MetricsChartTimeDomain } from '../schedule-detail-metrics-chart.types';

export type ZoomMetricsChartDomainParams = {
  visibleDomain: MetricsChartTimeDomain;
  bounds: MetricsChartTimeDomain;
  maxSpanMs: number;
  factor: number;
  anchorMs: number;
};

export type PanMetricsChartDomainToTimeParams = {
  visibleDomain: MetricsChartTimeDomain;
  bounds: MetricsChartTimeDomain;
  timeMs: number;
  anchorRatio?: number;
};

export type ResolveMetricsChartFollowDomainParams = {
  visibleDomain: MetricsChartTimeDomain;
  bounds: MetricsChartTimeDomain;
  nowMs: number;
  nextExecutionMs?: number | null;
};

export function getMetricsChartDomainSpanMs(
  domain: MetricsChartTimeDomain
): number {
  return domain.maxMs - domain.minMs;
}

export function isSameMetricsChartDomain(
  domain: MetricsChartTimeDomain,
  otherDomain: MetricsChartTimeDomain
): boolean {
  return (
    domain.minMs === otherDomain.minMs && domain.maxMs === otherDomain.maxMs
  );
}

function getDomainCenterMs(domain: MetricsChartTimeDomain): number {
  return (domain.minMs + domain.maxMs) / 2;
}

function expandDomainToMinSpan(
  domain: MetricsChartTimeDomain
): MetricsChartTimeDomain {
  const spanMs = getMetricsChartDomainSpanMs(domain);

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
  bounds: MetricsChartTimeDomain
): MetricsChartTimeDomain {
  const visibleSpanMs = getMetricsChartDomainSpanMs(visibleDomain);
  const boundsSpanMs = getMetricsChartDomainSpanMs(bounds);

  if (visibleSpanMs >= boundsSpanMs) {
    return bounds;
  }

  let minMs = Math.max(visibleDomain.minMs, bounds.minMs);
  let maxMs = minMs + visibleSpanMs;

  if (maxMs > bounds.maxMs) {
    maxMs = bounds.maxMs;
    minMs = maxMs - visibleSpanMs;
  }

  return expandDomainToMinSpan({ minMs, maxMs });
}

export function zoomMetricsChartDomain({
  visibleDomain,
  bounds,
  maxSpanMs,
  factor,
  anchorMs,
}: ZoomMetricsChartDomainParams): MetricsChartTimeDomain {
  const currentSpanMs = getMetricsChartDomainSpanMs(visibleDomain);
  const nextSpanMs = Math.min(currentSpanMs * factor, maxSpanMs);
  const anchorIsVisible =
    anchorMs >= visibleDomain.minMs && anchorMs <= visibleDomain.maxMs;
  const effectiveAnchorMs = anchorIsVisible
    ? anchorMs
    : getDomainCenterMs(visibleDomain);
  const anchorRatio = anchorIsVisible
    ? (effectiveAnchorMs - visibleDomain.minMs) / currentSpanMs
    : 0.5;

  const zoomedDomain = expandDomainToMinSpan({
    minMs: effectiveAnchorMs - nextSpanMs * anchorRatio,
    maxMs: effectiveAnchorMs + nextSpanMs * (1 - anchorRatio),
  });

  return clampMetricsChartVisibleDomain(zoomedDomain, bounds);
}

export function panMetricsChartDomainToTime({
  visibleDomain,
  bounds,
  timeMs,
  anchorRatio = CHART_NOW_ANCHOR_RATIO,
}: PanMetricsChartDomainToTimeParams): MetricsChartTimeDomain {
  const visibleSpanMs = getMetricsChartDomainSpanMs(visibleDomain);
  const clampedAnchorRatio = Math.min(Math.max(anchorRatio, 0), 1);
  const pannedDomain = {
    minMs: timeMs - visibleSpanMs * clampedAnchorRatio,
    maxMs: timeMs + visibleSpanMs * (1 - clampedAnchorRatio),
  };

  return clampMetricsChartVisibleDomain(pannedDomain, bounds);
}

/**
 * Domain used while live follow is active: `now` sits at its anchor unless the
 * next run would fall outside the view and still fits within the current span.
 */
export function resolveMetricsChartFollowDomain({
  visibleDomain,
  bounds,
  nowMs,
  nextExecutionMs,
}: ResolveMetricsChartFollowDomainParams): MetricsChartTimeDomain {
  const spanMs = getMetricsChartDomainSpanMs(visibleDomain);
  const nowAnchoredDomain = panMetricsChartDomainToTime({
    visibleDomain,
    bounds,
    timeMs: nowMs,
  });

  if (
    nextExecutionMs == null ||
    !Number.isFinite(nextExecutionMs) ||
    nextExecutionMs <= nowAnchoredDomain.maxMs
  ) {
    return nowAnchoredDomain;
  }

  const nextRunAnchoredDomain = panMetricsChartDomainToTime({
    visibleDomain,
    bounds,
    timeMs: nextExecutionMs,
    anchorRatio: CHART_NEXT_RUN_ANCHOR_RATIO,
  });

  return nextRunAnchoredDomain.minMs <= nowMs && spanMs > 0
    ? nextRunAnchoredDomain
    : nowAnchoredDomain;
}

export function canZoomMetricsChartIn(
  visibleDomain: MetricsChartTimeDomain
): boolean {
  return getMetricsChartDomainSpanMs(visibleDomain) > CHART_MIN_DOMAIN_SPAN_MS;
}

export function canZoomMetricsChartOut(
  visibleDomain: MetricsChartTimeDomain,
  maxSpanMs: number
): boolean {
  return getMetricsChartDomainSpanMs(visibleDomain) < maxSpanMs;
}
