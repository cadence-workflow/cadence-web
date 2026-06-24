import { type ScheduleMetricsChartSeriesData } from '../schedule-detail-metrics-chart-series.types';

export default function hasScheduleMetricsChartData(
  data: ScheduleMetricsChartSeriesData
) {
  return (
    data.successfulRuns.length > 0 ||
    data.missedExecutions.length > 0 ||
    data.nextExecutionTimeMs != null
  );
}
