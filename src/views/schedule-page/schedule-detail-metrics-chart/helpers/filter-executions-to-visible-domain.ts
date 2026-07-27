import { type ScheduleMetricsChartExecutionPoint } from '../schedule-detail-metrics-chart-series.types';
import { type MetricsChartTimeDomain } from '../schedule-detail-metrics-chart.types';

export default function filterExecutionsToVisibleDomain(
  executions: ScheduleMetricsChartExecutionPoint[],
  visibleDomain: MetricsChartTimeDomain | null
): ScheduleMetricsChartExecutionPoint[] {
  if (visibleDomain == null) {
    return [];
  }

  return executions.filter(
    ({ scheduledTimeMs }) =>
      scheduledTimeMs >= visibleDomain.minMs &&
      scheduledTimeMs <= visibleDomain.maxMs
  );
}
