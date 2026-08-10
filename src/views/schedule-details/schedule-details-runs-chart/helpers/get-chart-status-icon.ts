import { type IconType } from 'react-icons';
import {
  MdAdjust,
  MdBlock,
  MdCheckCircleOutline,
  MdReportGmailerrorred,
} from 'react-icons/md';

import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import { type ChartStatusIconVariant } from '../../schedule-details-runs-chart-glyph/schedule-details-runs-chart-glyph.types';

export default function getChartStatusIcon(
  variant: ChartStatusIconVariant
): IconType {
  switch (variant) {
    case WORKFLOW_STATUSES.completed:
    case WORKFLOW_STATUSES.continuedAsNew:
      return MdCheckCircleOutline;
    case WORKFLOW_STATUSES.failed:
    case WORKFLOW_STATUSES.timedOut:
    case WORKFLOW_STATUSES.terminated:
      return MdReportGmailerrorred;
    case WORKFLOW_STATUSES.canceled:
      return MdBlock;
    case 'next':
      return MdAdjust;
  }
}
