import { type MetricsChartTimeDomain } from '../schedule-detail-metrics-chart.types';

export type ShiftMetricsChartViewDomainParams = {
  viewDomain: MetricsChartTimeDomain;
  deltaMs: number;
  bounds?: MetricsChartTimeDomain | null;
};

export default function shiftMetricsChartViewDomain({
  viewDomain,
  deltaMs,
  bounds,
}: ShiftMetricsChartViewDomainParams): MetricsChartTimeDomain {
  const spanMs = viewDomain.maxMs - viewDomain.minMs;
  let minMs = viewDomain.minMs + deltaMs;
  let maxMs = viewDomain.maxMs + deltaMs;

  if (bounds) {
    if (minMs < bounds.minMs) {
      minMs = bounds.minMs;
      maxMs = minMs + spanMs;
    }

    if (maxMs > bounds.maxMs) {
      maxMs = bounds.maxMs;
      minMs = maxMs - spanMs;
    }
  }

  return { minMs, maxMs };
}
