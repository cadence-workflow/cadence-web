import { scaleLinear } from '@visx/scale';
import { type ScaleLinear } from 'd3-scale';

import {
  CHART_DEFAULT_PAST_WINDOW_MS,
  CHART_FUTURE_GUTTER_MS,
  CHART_MIN_DOMAIN_SPAN_MS,
  CHART_SIDE_PADDING_PX,
} from './schedule-detail-metrics-chart.constants';
import {
  type CreateMetricsChartXScaleParams,
  type MetricsChartPixelRange,
  type MetricsChartTimeDomain,
  type ResolveMetricsChartPixelRangeParams,
  type ResolveMetricsChartTimeDomainParams,
} from './schedule-detail-metrics-chart.types';

type MetricsChartXScale = ScaleLinear<number, number, never>;

export function resolveMetricsChartTimeDomain({
  timestampsMs,
  nowMs,
  nextExecutionMs,
}: ResolveMetricsChartTimeDomainParams): MetricsChartTimeDomain | null {
  if (!Number.isFinite(nowMs)) {
    return null;
  }

  const validTimestampsMs = timestampsMs.filter(Number.isFinite);

  if (validTimestampsMs.length === 0 && nextExecutionMs == null) {
    return {
      minMs: nowMs - CHART_DEFAULT_PAST_WINDOW_MS,
      maxMs: nowMs + CHART_FUTURE_GUTTER_MS,
    };
  }

  const dataMinMs =
    validTimestampsMs.length > 0 ? Math.min(...validTimestampsMs) : nowMs;
  const dataMaxMs =
    validTimestampsMs.length > 0 ? Math.max(...validTimestampsMs) : nowMs;

  let minMs = Math.min(dataMinMs, nowMs);
  let maxMs = Math.max(dataMaxMs, nowMs, nowMs + CHART_FUTURE_GUTTER_MS);

  if (
    nextExecutionMs != null &&
    Number.isFinite(nextExecutionMs) &&
    nextExecutionMs > nowMs
  ) {
    maxMs = Math.max(maxMs, nextExecutionMs + CHART_FUTURE_GUTTER_MS);
  }

  if (maxMs <= minMs) {
    maxMs = minMs + CHART_MIN_DOMAIN_SPAN_MS;
  } else if (maxMs - minMs < CHART_MIN_DOMAIN_SPAN_MS) {
    const centerMs = (minMs + maxMs) / 2;
    minMs = centerMs - CHART_MIN_DOMAIN_SPAN_MS / 2;
    maxMs = centerMs + CHART_MIN_DOMAIN_SPAN_MS / 2;
  }

  return { minMs, maxMs };
}

export function resolveMetricsChartPixelRange({
  widthPx,
  sidePaddingPx = CHART_SIDE_PADDING_PX,
}: ResolveMetricsChartPixelRangeParams): MetricsChartPixelRange | null {
  if (!Number.isFinite(widthPx) || widthPx <= 0) {
    return null;
  }

  const drawableWidthPx = widthPx - sidePaddingPx * 2;

  if (drawableWidthPx <= 0) {
    return null;
  }

  return {
    startPx: sidePaddingPx,
    endPx: sidePaddingPx + drawableWidthPx,
  };
}

export function createMetricsChartXScale({
  domain,
  range,
}: CreateMetricsChartXScaleParams): MetricsChartXScale | null {
  if (
    !Number.isFinite(domain.minMs) ||
    !Number.isFinite(domain.maxMs) ||
    domain.maxMs <= domain.minMs
  ) {
    return null;
  }

  if (
    !Number.isFinite(range.startPx) ||
    !Number.isFinite(range.endPx) ||
    range.endPx <= range.startPx
  ) {
    return null;
  }

  return scaleLinear<number>({
    domain: [domain.minMs, domain.maxMs],
    range: [range.startPx, range.endPx],
    clamp: true,
  });
}

export function timeMsToPixel(
  timeMs: number,
  scale: MetricsChartXScale
): number {
  return scale(timeMs);
}

export function pixelToTimeMs(
  pixel: number,
  scale: MetricsChartXScale
): number {
  return scale.invert(pixel);
}
