import { type WorkflowEventStatus } from '../workflow-history-v2.types';

import { type EventGroupStatus } from './workflow-history-filters-menu.types';

export const WORKFLOW_HISTORY_EVENT_STATUS_TO_GROUP_STATUS_MAP = {
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED',
  ONGOING: 'PENDING',
  WAITING: 'PENDING',
} as const satisfies Record<WorkflowEventStatus, EventGroupStatus>;
