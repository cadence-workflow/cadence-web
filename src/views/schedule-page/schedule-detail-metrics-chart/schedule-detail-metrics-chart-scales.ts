import { scaleLinear, scaleTime } from '@visx/scale';


import {
  CHART_MARGIN,
  FUTURE_GUTTER_RATIO,
} from './schedule-detail-metrics-chart.constants';

export type TimeDomainMs = {
  minMs: number;
  maxMs: number;
};

export type ChartInnerDimensions = {
  innerWidth: number;
  innerHeight: number;
  margin: typeof CHART_MARGIN;
};

export function getMetricsChartInnerDimensions(
  width: number,
  height: number
): ChartInnerDimensions {
  const innerWidth = Math.max(
    0,
    width - CHART_MARGIN.left - CHART_MARGIN.right
  );
  const innerHeight = Math.max(
    0,
    height - CHART_MARGIN.top - CHART_MARGIN.bottom
  );

  return {
    innerWidth,
    innerHeight,
    margin: CHART_MARGIN,
  };
}

export function getDefaultMetricsChartTimeDomain(
  nowMs: number,
  windowMs: number
): TimeDomainMs {
  if (windowMs <= 0) {
    return { minMs: nowMs, maxMs: nowMs };
  }

  return {
    minMs: nowMs - windowMs,
    maxMs: nowMs,
  };
}

export function extendTimeDomainWithFutureGutter(
  domain: TimeDomainMs,
  nowMs: number,
  gutterRatio = FUTURE_GUTTER_RATIO
): TimeDomainMs {
  const dataSpanMs = Math.max(domain.maxMs - domain.minMs, 1);
  const gutterMs = dataSpanMs * gutterRatio;

  return {
    minMs: domain.minMs,
    maxMs: Math.max(domain.maxMs, nowMs) + gutterMs,
  };
}

export function createMetricsChartTimeScale({
  domain,
  innerWidth,
}: {
  domain: TimeDomainMs;
  innerWidth: number;
}) {
  return scaleTime({
    domain: [domain.minMs, domain.maxMs],
    range: [0, innerWidth],
  });
}

export function createMetricsChartCountScale({
  maxCount,
  innerHeight,
}: {
  maxCount: number;
  innerHeight: number;
}) {
  return scaleLinear({
    domain: [0, Math.max(maxCount, 1)],
    range: [innerHeight, 0],
    nice: true,
  });
}
