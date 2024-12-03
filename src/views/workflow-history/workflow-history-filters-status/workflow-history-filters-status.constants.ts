import { WORKFLOW_EVENT_STATUS } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.constants';
import { type WorkflowEventStatus } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.types';

export const WORKFLOW_HISTORY_EVENT_FILTERING_STATUS_LABELS_MAP = {
  [WORKFLOW_EVENT_STATUS.ONGOING]: 'On Going',
  [WORKFLOW_EVENT_STATUS.WAITING]: 'Waiting',
  [WORKFLOW_EVENT_STATUS.CANCELED]: 'Canceled',
  [WORKFLOW_EVENT_STATUS.FAILED]: 'Failed',
  [WORKFLOW_EVENT_STATUS.COMPLETED]: 'Completed',
} as const satisfies Record<WorkflowEventStatus, string>;
