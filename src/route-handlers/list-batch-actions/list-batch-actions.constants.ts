import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

import { type BatchActionStatus } from './list-batch-actions.types';

export const BATCH_ACTION_BATCHER_DOMAIN = 'cadence-batcher';
export const BATCH_ACTION_WORKFLOW_TYPE = 'cadence-sys-batch-workflow-v2';

export const BATCH_ACTION_DOMAIN_SEARCH_ATTRIBUTE = 'CustomDomain';

export const BATCH_ACTION_STATUS_BY_CLOSE_STATUS: Record<
  WorkflowExecutionCloseStatus,
  BatchActionStatus
> = {
  WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID: 'RUNNING',
  WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED: 'COMPLETED',
  WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED: 'FAILED',
  WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT: 'FAILED',
  WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED: 'ABORTED',
  WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED: 'ABORTED',
  WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW: 'RUNNING',
};

export const BATCH_ACTION_STATUS = {
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  ABORTED: 'ABORTED',
  FAILED: 'FAILED',
} as const satisfies Record<BatchActionStatus, BatchActionStatus>;
