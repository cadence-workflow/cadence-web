import {
  CHART_DEFAULT_PAST_WINDOW_MS,
  CHART_DEFAULT_VIEW_SPAN_MS,
  CHART_EXPECTED_RUN_SLOT_PX,
  CHART_FUTURE_GUTTER_MS,
  CHART_INITIAL_EXPECTED_RUN_COUNT,
  CHART_NOW_ANCHOR_RATIO,
  CHART_SIDE_PADDING_PX,
} from '../schedule-detail-metrics-chart.constants';
import { type MetricsChartTimeDomain } from '../schedule-detail-metrics-chart.types';

export type ResolveInitialMetricsChartViewDomainParams = {
  nowMs: number;
  chartWidthPx: number;
  nextExecutionMs?: number | null;
  timestampsMs?: number[];
  expectedTimesMs?: number[];
  futureGutterMs?: number;
};

export function getReadableExpectedRunCount(chartWidthPx: number): number {
  const drawableWidthPx = chartWidthPx - CHART_SIDE_PADDING_PX * 2;

  return Math.min(
    CHART_INITIAL_EXPECTED_RUN_COUNT,
    Math.max(1, Math.floor(drawableWidthPx / CHART_EXPECTED_RUN_SLOT_PX))
  );
}

export default function resolveInitialMetricsChartViewDomain({
  nowMs,
  chartWidthPx,
  nextExecutionMs,
  timestampsMs = [],
  expectedTimesMs = [],
  futureGutterMs = CHART_FUTURE_GUTTER_MS,
}: ResolveInitialMetricsChartViewDomainParams): MetricsChartTimeDomain {
  const readableRunCount = getReadableExpectedRunCount(chartWidthPx);
  const validTimestampsMs = timestampsMs
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  const readableTimestampsMs = validTimestampsMs.slice(-readableRunCount);
  const readableExpectedTimesMs = expectedTimesMs
    .filter(Number.isFinite)
    .sort((a, b) => a - b)
    .slice(-readableRunCount);
  const requiredViewEndMs = Math.max(
    nowMs + futureGutterMs,
    nextExecutionMs != null && Number.isFinite(nextExecutionMs)
      ? nextExecutionMs + futureGutterMs
      : nowMs + futureGutterMs,
    validTimestampsMs.length > 0 ? Math.max(...validTimestampsMs) : nowMs
  );
  const renderedViewStartMs =
    readableTimestampsMs.length > 0 ? Math.min(...readableTimestampsMs) : null;
  const expectedViewStartMs =
    readableExpectedTimesMs.length > 0
      ? Math.min(...readableExpectedTimesMs)
      : null;
  const requiredViewStartMs = Math.min(
    nowMs,
    expectedViewStartMs ??
      renderedViewStartMs ??
      Math.max(
        requiredViewEndMs - CHART_DEFAULT_VIEW_SPAN_MS,
        validTimestampsMs.length > 0
          ? Math.min(...validTimestampsMs)
          : nowMs - CHART_DEFAULT_PAST_WINDOW_MS
      )
  );
  const requiredPastSpanMs = nowMs - requiredViewStartMs;
  const requiredFutureSpanMs = requiredViewEndMs - nowMs;
  const viewSpanMs = Math.max(
    requiredPastSpanMs / CHART_NOW_ANCHOR_RATIO,
    requiredFutureSpanMs / (1 - CHART_NOW_ANCHOR_RATIO)
  );

  return {
    minMs: nowMs - viewSpanMs * CHART_NOW_ANCHOR_RATIO,
    maxMs: nowMs + viewSpanMs * (1 - CHART_NOW_ANCHOR_RATIO),
  };
}
