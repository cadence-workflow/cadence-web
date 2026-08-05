import { type Theme } from 'baseui';

import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import { type ChartGlyphVariant } from '../schedule-details-runs-chart-glyph.types';

export default function getChartGlyphColor(
  theme: Theme,
  variant: ChartGlyphVariant
): string {
  switch (variant) {
    case WORKFLOW_STATUSES.completed:
    case WORKFLOW_STATUSES.continuedAsNew:
      return theme.colors.positive400;
    case WORKFLOW_STATUSES.failed:
    case WORKFLOW_STATUSES.timedOut:
      return theme.colors.negative400;
    case WORKFLOW_STATUSES.running:
      return theme.colors.accent400;
    case WORKFLOW_STATUSES.canceled:
    case WORKFLOW_STATUSES.terminated:
      return theme.colors.warning400;
    case 'skipped':
    case 'loading':
    case 'next':
      return theme.colors.contentSecondary;
  }
}
