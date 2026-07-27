import { type Theme } from 'baseui';

import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import {
  type ScheduleMetricsChartRun,
  type ScheduleMetricsChartStatusVariant,
} from '../schedule-detail-metrics-chart-series.types';

export function getScheduleMetricsChartStatus(
  run: ScheduleMetricsChartRun
): ScheduleMetricsChartStatusVariant {
  switch (run.status) {
    case WORKFLOW_STATUSES.completed:
    case WORKFLOW_STATUSES.continuedAsNew:
      return 'completed';
    case WORKFLOW_STATUSES.timedOut:
    case WORKFLOW_STATUSES.failed:
    case WORKFLOW_STATUSES.terminated:
      return 'failed';
    case WORKFLOW_STATUSES.canceled:
      return 'canceled';
    case WORKFLOW_STATUSES.running:
      return 'running';
  }
}

export function getScheduleMetricsChartStatusColor(
  theme: Theme,
  variant: ScheduleMetricsChartStatusVariant
): string {
  switch (variant) {
    case 'completed':
      return theme.colors.positive400;
    case 'failed':
      return theme.colors.negative400;
    case 'running':
      return theme.colors.accent400;
    case 'canceled':
      return theme.colors.warning400;
    case 'backfill':
    case 'skipped':
    case 'next':
      return theme.colors.contentSecondary;
  }
}
