import { type ChartSeriesData } from '../schedule-details-runs-chart-series.types';

export default function hasScheduleRunsChartData(data: ChartSeriesData) {
  return (
    data.runs.length > 0 ||
    data.skippedExecutions.length > 0 ||
    data.unconfirmedExecutions.length > 0 ||
    data.nextExecutionTimeMs != null
  );
}
