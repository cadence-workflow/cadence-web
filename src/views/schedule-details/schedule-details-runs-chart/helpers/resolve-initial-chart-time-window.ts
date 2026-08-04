import {
  CHART_DEFAULT_PAST_WINDOW_MS,
  CHART_EXPECTED_RUN_SLOT_PX,
  CHART_FUTURE_GUTTER_MS,
  CHART_INITIAL_EXPECTED_RUN_COUNT,
  CHART_NOW_ANCHOR_RATIO,
  CHART_SIDE_PADDING_PX,
} from '../schedule-details-runs-chart.constants';
import {
  type ChartTimeWindow,
  type ResolveInitialChartTimeWindowParams,
} from '../schedule-details-runs-chart.types';

export function getReadableExpectedRunCount(chartWidthPx: number): number {
  const drawableWidthPx = chartWidthPx - CHART_SIDE_PADDING_PX * 2;

  return Math.min(
    CHART_INITIAL_EXPECTED_RUN_COUNT,
    Math.max(1, Math.floor(drawableWidthPx / CHART_EXPECTED_RUN_SLOT_PX))
  );
}

export default function resolveInitialChartTimeWindow({
  nowMs,
  chartWidthPx,
  nextExecutionMs,
  timestampsMs = [],
  futureGutterMs = CHART_FUTURE_GUTTER_MS,
}: ResolveInitialChartTimeWindowParams): ChartTimeWindow {
  const readableRunCount = getReadableExpectedRunCount(chartWidthPx);
  const validTimestampsMs = timestampsMs
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  const readableTimestampsMs = validTimestampsMs.slice(-readableRunCount);
  const requiredWindowEndMs = Math.max(
    nowMs + futureGutterMs,
    nextExecutionMs != null && Number.isFinite(nextExecutionMs)
      ? nextExecutionMs + futureGutterMs
      : nowMs + futureGutterMs,
    validTimestampsMs.length > 0 ? Math.max(...validTimestampsMs) : nowMs
  );
  const renderedWindowStartMs =
    readableTimestampsMs.length > 0 ? Math.min(...readableTimestampsMs) : null;
  const requiredWindowStartMs = Math.min(
    nowMs,
    renderedWindowStartMs ??
      Math.max(
        requiredWindowEndMs - CHART_DEFAULT_PAST_WINDOW_MS,
        validTimestampsMs.length > 0
          ? Math.min(...validTimestampsMs)
          : nowMs - CHART_DEFAULT_PAST_WINDOW_MS
      )
  );
  const requiredPastSpanMs = nowMs - requiredWindowStartMs;
  const requiredFutureSpanMs = requiredWindowEndMs - nowMs;
  const windowSpanMs = Math.max(
    requiredPastSpanMs / CHART_NOW_ANCHOR_RATIO,
    requiredFutureSpanMs / (1 - CHART_NOW_ANCHOR_RATIO)
  );

  return {
    minMs: nowMs - windowSpanMs * CHART_NOW_ANCHOR_RATIO,
    maxMs: nowMs + windowSpanMs * (1 - CHART_NOW_ANCHOR_RATIO),
  };
}
