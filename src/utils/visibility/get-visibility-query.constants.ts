import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

// Numerical query CloseStatus is 0-indexed and excludes INVALID.
// https://cadenceworkflow.io/docs/concepts/search-workflows/#query-capabilities
export const WORKFLOW_STATUS_QUERIES: Record<WorkflowStatus, string> = {
  [WORKFLOW_STATUSES.running]: 'CloseTime = missing',
  [WORKFLOW_STATUSES.completed]: 'CloseStatus = 0',
  [WORKFLOW_STATUSES.failed]: 'CloseStatus = 1',
  [WORKFLOW_STATUSES.canceled]: 'CloseStatus = 2',
  [WORKFLOW_STATUSES.terminated]: 'CloseStatus = 3',
  [WORKFLOW_STATUSES.continuedAsNew]: 'CloseStatus = 4',
  [WORKFLOW_STATUSES.timedOut]: 'CloseStatus = 5',
};
