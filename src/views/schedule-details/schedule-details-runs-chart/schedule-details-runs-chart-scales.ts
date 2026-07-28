import { scaleLinear } from '@visx/scale';
import { type ScaleLinear } from 'd3-scale';

import {
  CHART_DEFAULT_PAST_WINDOW_MS,
  CHART_FUTURE_GUTTER_MS,
  CHART_MIN_DOMAIN_SPAN_MS,
  CHART_SIDE_PADDING_PX,
} from './schedule-details-runs-chart.constants';
import {
  type CreateRunsChartXScaleParams,
  type ResolveRunsChartPixelRangeParams,
  type ResolveRunsChartTimeDomainParams,
  type RunsChartPixelRange,
  type RunsChartTimeDomain,
} from './schedule-details-runs-chart.types';

type RunsChartXScale = ScaleLinear<number, number, never>;

export function resolveRunsChartTimeDomain({
  timestampsMs,
  nowMs,
  nextExecutionMs,
  futureGutterMs = CHART_FUTURE_GUTTER_MS,
  minimumTimeMs,
}: ResolveRunsChartTimeDomainParams): RunsChartTimeDomain | null {
  if (!Number.isFinite(nowMs)) {
    return null;
  }

  const validTimestampsMs = timestampsMs.filter(Number.isFinite);

  let minMs: number;
  let maxMs: number;

  if (validTimestampsMs.length === 0 && nextExecutionMs == null) {
    minMs = Math.max(
      nowMs - CHART_DEFAULT_PAST_WINDOW_MS,
      minimumTimeMs ?? Number.NEGATIVE_INFINITY
    );
    maxMs = nowMs + futureGutterMs;
  } else {
    const dataMinMs =
      validTimestampsMs.length > 0 ? Math.min(...validTimestampsMs) : nowMs;
    const dataMaxMs =
      validTimestampsMs.length > 0 ? Math.max(...validTimestampsMs) : nowMs;

    minMs = Math.max(
      Math.min(dataMinMs, nowMs),
      minimumTimeMs ?? Number.NEGATIVE_INFINITY
    );
    maxMs = Math.max(dataMaxMs, nowMs, nowMs + futureGutterMs);

    if (
      nextExecutionMs != null &&
      Number.isFinite(nextExecutionMs) &&
      nextExecutionMs > nowMs
    ) {
      maxMs = Math.max(maxMs, nextExecutionMs + futureGutterMs);
    }
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

export function resolveRunsChartPixelRange({
  widthPx,
  sidePaddingPx = CHART_SIDE_PADDING_PX,
}: ResolveRunsChartPixelRangeParams): RunsChartPixelRange | null {
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

export function createRunsChartXScale({
  domain,
  range,
}: CreateRunsChartXScaleParams): RunsChartXScale | null {
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
