import {
  type ChartSeriesRun,
  type ChartSeriesRunStatus,
} from '../schedule-details-runs-chart-series.types';

const STATUS_LABELS: Record<ChartSeriesRunStatus, string> = {
  completed: 'Completed',
  failed: 'Failed',
  running: 'Running',
  canceled: 'Canceled',
};

export function formatChartSeriesRunGroupLabel(runs: ChartSeriesRun[]): string {
  if (runs.length === 1) {
    const [run] = runs;
    return `${STATUS_LABELS[run.status]} schedule run ${run.runId}`;
  }

  return `${runs.length} schedule runs at ${new Date(runs[0].scheduledTimeMs).toISOString()}`;
}

export function formatChartSeriesMomentLabel(
  variant: 'skipped' | 'next',
  scheduledTimeMs: number
): string {
  const label = variant === 'next' ? 'Next run' : 'Skipped run';

  return `${label} at ${new Date(scheduledTimeMs).toISOString()}`;
}
