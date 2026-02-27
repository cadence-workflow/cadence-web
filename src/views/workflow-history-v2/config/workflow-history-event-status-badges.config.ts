import {
  MdBlock,
  MdCheckCircleOutline,
  MdHourglassTop,
  MdReportGmailerrorred,
} from 'react-icons/md';

import { styled } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.styles';
import { type WorkflowHistoryEventStatusBadgeConfig } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.types';
import { type WorkflowEventStatus } from '../workflow-history-v2.types';

const workflowHistoryEventStatusBadgesConfig = {
  COMPLETED: {
    icon: MdCheckCircleOutline,
    hierarchy: 'secondary',
    color: 'positive',
  },
  FAILED: {
    icon: MdReportGmailerrorred,
    hierarchy: 'primary',
    color: 'negative',
  },
  CANCELED: {
    icon: MdBlock,
    hierarchy: 'secondary',
    color: 'negative',
  },
  ONGOING: {
    icon: styled.OngoingSpinner,
    hierarchy: 'primary',
    color: 'accent',
  },
  WAITING: {
    icon: MdHourglassTop,
    hierarchy: 'secondary',
    color: 'primary',
  },
} as const satisfies Record<
  WorkflowEventStatus,
  WorkflowHistoryEventStatusBadgeConfig
>;

export default workflowHistoryEventStatusBadgesConfig;
