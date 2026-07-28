import { type ChartSeriesData } from '../schedule-details-runs-chart-series.types';

export default function hasScheduleRunsChartData(data: ChartSeriesData) {
  return (
    data.successfulRuns.length > 0 ||
    data.missedExecutions.length > 0 ||
    data.nextExecutionTimeMs != null
  );
}
