import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import { type ChartSeriesRun } from '../schedule-details-runs-chart-series.types';

export function formatChartSeriesRunGroupLabel(runs: ChartSeriesRun[]): string {
  if (runs.length === 1) {
    const [run] = runs;
    return `${WORKFLOW_STATUS_NAMES[run.status]} schedule run at ${new Date(run.scheduledTimeMs).toISOString()}`;
  }

  return `${runs.length} schedule runs at ${new Date(runs[0].scheduledTimeMs).toISOString()}`;
}

export function formatChartSeriesMomentLabel(
  variant: 'skipped' | 'pending' | 'next',
  scheduledTimeMs: number
): string {
  const labels = {
    skipped: 'Skipped run',
    pending: 'Loading run',
    next: 'Next run',
  } satisfies Record<typeof variant, string>;

  return `${labels[variant]} at ${new Date(scheduledTimeMs).toISOString()}`;
}
