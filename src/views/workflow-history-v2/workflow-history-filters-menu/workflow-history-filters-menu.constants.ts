import {
  type WorkflowEventStatus,
  type HistoryEventGroupType,
} from '../workflow-history-v2.types';

import {
  type EventGroupStatus,
  type EventGroupCategory,
} from './workflow-history-filters-menu.types';

export const WORKFLOW_HISTORY_EVENT_GROUP_TYPE_TO_CATEGORY_MAP = {
  Activity: 'ACTIVITY',
  LocalActivity: 'ACTIVITY',
  ChildWorkflowExecution: 'CHILDWORKFLOW',
  Decision: 'DECISION',
  SignalExternalWorkflowExecution: 'SIGNAL',
  WorkflowSignaled: 'SIGNAL',
  Timer: 'TIMER',
  RequestCancelExternalWorkflowExecution: 'WORKFLOW',
  Event: 'WORKFLOW',
} as const satisfies Record<HistoryEventGroupType, EventGroupCategory>;

export const WORKFLOW_HISTORY_EVENT_STATUS_TO_GROUP_STATUS_MAP = {
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED',
  ONGOING: 'PENDING',
  WAITING: 'PENDING',
} as const satisfies Record<WorkflowEventStatus, EventGroupStatus>;
