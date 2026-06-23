import {
  CHART_DEFAULT_PAST_WINDOW_MS,
  CHART_DEFAULT_VIEW_SPAN_MS,
  CHART_FUTURE_GUTTER_MS,
} from '../schedule-detail-metrics-chart.constants';
import { type MetricsChartTimeDomain } from '../schedule-detail-metrics-chart.types';

export type ResolveInitialMetricsChartViewDomainParams = {
  nowMs: number;
  nextExecutionMs?: number | null;
  timestampsMs?: number[];
};

export default function resolveInitialMetricsChartViewDomain({
  nowMs,
  nextExecutionMs,
  timestampsMs = [],
}: ResolveInitialMetricsChartViewDomainParams): MetricsChartTimeDomain {
  const validTimestampsMs = timestampsMs.filter(Number.isFinite);
  const viewEndMs = Math.max(
    nowMs + CHART_FUTURE_GUTTER_MS,
    nextExecutionMs != null && Number.isFinite(nextExecutionMs)
      ? nextExecutionMs + CHART_FUTURE_GUTTER_MS
      : nowMs + CHART_FUTURE_GUTTER_MS,
    validTimestampsMs.length > 0 ? Math.max(...validTimestampsMs) : nowMs
  );
  const viewStartMs = Math.max(
    viewEndMs - CHART_DEFAULT_VIEW_SPAN_MS,
    validTimestampsMs.length > 0
      ? Math.min(...validTimestampsMs)
      : nowMs - CHART_DEFAULT_PAST_WINDOW_MS
  );

  return {
    minMs: viewStartMs,
    maxMs: viewEndMs,
  };
}
