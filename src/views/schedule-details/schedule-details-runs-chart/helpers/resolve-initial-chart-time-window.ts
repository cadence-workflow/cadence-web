import resolveCronScheduleIntervalMs from '@/views/schedule-details/hooks/use-schedule-runs-chart-data/helpers/resolve-cron-schedule-interval-ms';

import {
  CHART_DEFAULT_PAST_WINDOW_MS,
  CHART_EXPECTED_RUN_SLOT_PX,
  CHART_INITIAL_EXPECTED_RUN_COUNT,
  CHART_MIN_DOMAIN_SPAN_MS,
  CHART_NOW_ANCHOR_RATIO,
  CHART_MAX_ZOOM_OUT_MARKER_SPACING_PX,
  CHART_SIDE_PADDING_PX,
} from '../schedule-details-runs-chart.constants';
import {
  type ResolveInitialChartTimeWindowParams,
  type ResolveInitialChartTimeWindowResult,
} from '../schedule-details-runs-chart.types';

import resolveChartSpanFromMarkerIntervalMs from './resolve-chart-span-from-marker-interval-ms';

export function getReadableExpectedRunCount(chartWidthPx: number): number {
  const drawableWidthPx = chartWidthPx - CHART_SIDE_PADDING_PX * 2;

  return Math.min(
    CHART_INITIAL_EXPECTED_RUN_COUNT,
    Math.max(1, Math.floor(drawableWidthPx / CHART_EXPECTED_RUN_SLOT_PX))
  );
}

function resolveFallbackScheduleIntervalMs({
  nowMs,
  chartWidthPx,
  nextExecutionMs,
}: Pick<
  ResolveInitialChartTimeWindowParams,
  'nowMs' | 'chartWidthPx' | 'nextExecutionMs'
>): number {
  if (
    nextExecutionMs != null &&
    Number.isFinite(nextExecutionMs) &&
    nextExecutionMs > nowMs
  ) {
    return nextExecutionMs - nowMs;
  }

  return Math.max(
    CHART_MIN_DOMAIN_SPAN_MS,
    CHART_DEFAULT_PAST_WINDOW_MS / getReadableExpectedRunCount(chartWidthPx)
  );
}

export default function resolveInitialChartTimeWindow({
  nowMs,
  chartWidthPx,
  cronExpression,
  nextExecutionMs,
}: ResolveInitialChartTimeWindowParams): ResolveInitialChartTimeWindowResult {
  const scheduleIntervalMs =
    resolveCronScheduleIntervalMs(cronExpression, nowMs) ??
    resolveFallbackScheduleIntervalMs({ nowMs, chartWidthPx, nextExecutionMs });
  const comfortableSpanMs = resolveChartSpanFromMarkerIntervalMs({
    intervalMs: scheduleIntervalMs,
    chartWidthPx,
    pxPerInterval: CHART_EXPECTED_RUN_SLOT_PX,
  });
  const maxSpanMs = resolveChartSpanFromMarkerIntervalMs({
    intervalMs: scheduleIntervalMs,
    chartWidthPx,
    pxPerInterval: CHART_MAX_ZOOM_OUT_MARKER_SPACING_PX,
  });
  const windowSpanMs = Math.max(comfortableSpanMs, CHART_MIN_DOMAIN_SPAN_MS);
  const resolvedMaxSpanMs = Math.max(maxSpanMs, windowSpanMs);
  const window = {
    minMs: nowMs - windowSpanMs * CHART_NOW_ANCHOR_RATIO,
    maxMs: nowMs + windowSpanMs * (1 - CHART_NOW_ANCHOR_RATIO),
  };

  return { window, maxSpanMs: resolvedMaxSpanMs };
}
