import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import { CHART_SERIES_MOMENT_MARKER_LABELS } from '../schedule-details-runs-chart-series.constants';
import { type ChartSeriesRun } from '../schedule-details-runs-chart-series.types';

export function formatChartSeriesRunGroupLabel(runs: ChartSeriesRun[]): string {
  if (runs.length === 1) {
    const [run] = runs;
    return `${WORKFLOW_STATUS_NAMES[run.status]} schedule run at ${new Date(run.scheduledTimeMs).toISOString()}`;
  }

  return `${runs.length} schedule runs at ${new Date(runs[0].scheduledTimeMs).toISOString()}`;
}

export function formatChartSeriesMomentLabel(
  variant: 'skipped' | 'loading' | 'next',
  scheduledTimeMs: number
): string {
  return `${CHART_SERIES_MOMENT_MARKER_LABELS[variant]} at ${new Date(scheduledTimeMs).toISOString()}`;
}
