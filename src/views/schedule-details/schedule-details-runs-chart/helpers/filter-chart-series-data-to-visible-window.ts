import { type ChartSeriesData } from '../../schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';
import { type ChartTimeWindow } from '../schedule-details-runs-chart.types';

const EMPTY_DATA: ChartSeriesData = {
  runs: [],
  skippedExecutions: [],
  unconfirmedExecutions: [],
  nextExecutionTimeMs: null,
};

export default function filterChartSeriesDataToVisibleWindow(
  data: ChartSeriesData,
  visibleWindow: ChartTimeWindow | null
): ChartSeriesData {
  if (visibleWindow == null) {
    return EMPTY_DATA;
  }

  const isVisible = (scheduledTimeMs: number) =>
    scheduledTimeMs >= visibleWindow.minMs &&
    scheduledTimeMs <= visibleWindow.maxMs;

  return {
    runs: data.runs.filter((run) => isVisible(run.scheduledTimeMs)),
    skippedExecutions: data.skippedExecutions.filter((point) =>
      isVisible(point.scheduledTimeMs)
    ),
    unconfirmedExecutions: data.unconfirmedExecutions.filter((point) =>
      isVisible(point.scheduledTimeMs)
    ),
    nextExecutionTimeMs:
      data.nextExecutionTimeMs != null && isVisible(data.nextExecutionTimeMs)
        ? data.nextExecutionTimeMs
        : null,
  };
}
