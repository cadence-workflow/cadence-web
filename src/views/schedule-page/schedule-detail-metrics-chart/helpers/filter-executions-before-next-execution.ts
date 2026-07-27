import { type ScheduleMetricsChartExecutionPoint } from '../schedule-detail-metrics-chart-series.types';

/**
 * Drops executions that land on or after the next run. The next run time and
 * the run list come from two independently polled APIs, so a run that has just
 * started would otherwise stack on top of the next-run marker until the
 * schedule description catches up.
 */
export default function filterExecutionsBeforeNextExecution(
  executions: ScheduleMetricsChartExecutionPoint[],
  nextExecutionTimeMs: number | null
): ScheduleMetricsChartExecutionPoint[] {
  if (nextExecutionTimeMs == null) {
    return executions;
  }

  return executions.filter(
    ({ scheduledTimeMs }) => scheduledTimeMs < nextExecutionTimeMs
  );
}
