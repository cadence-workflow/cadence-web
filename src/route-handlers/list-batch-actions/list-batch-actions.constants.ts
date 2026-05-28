import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';
import { type BatchActionStatus } from '@/views/domain-batch-actions/domain-batch-actions.types';

export const BATCH_ACTION_BATCHER_DOMAIN = 'cadence-batcher';
export const BATCH_ACTION_WORKFLOW_TYPE = 'cadence-sys-batch-workflow-v2';

export const BATCH_ACTION_DOMAIN_SEARCH_ATTRIBUTE = 'CustomDomain';

export const BATCH_ACTION_STATUS_BY_CLOSE_STATUS: Record<
  WorkflowExecutionCloseStatus,
  BatchActionStatus
> = {
  WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID: 'running',
  WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED: 'completed',
  WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED: 'failed',
  WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT: 'failed',
  WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED: 'aborted',
  WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED: 'aborted',
  WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW: 'running',
};
