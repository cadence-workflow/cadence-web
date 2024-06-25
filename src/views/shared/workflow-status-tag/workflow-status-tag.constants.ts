import type { WorkflowStatus } from './workflow-status-tag.types';

export const WORKFLOW_STATUSES = {
  running: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
  completed: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
  failed: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
  canceled: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED',
  terminated: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
  continuedAsNew: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW',
  timedOut: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT',
} as const satisfies Record<string, WorkflowStatus>;

export const WORKFLOW_STATUS_NAMES = {
  [WORKFLOW_STATUSES.running]: 'Running',
  [WORKFLOW_STATUSES.completed]: 'Completed',
  [WORKFLOW_STATUSES.failed]: 'Failed',
  [WORKFLOW_STATUSES.canceled]: 'Canceled',
  [WORKFLOW_STATUSES.terminated]: 'Terminated',
  [WORKFLOW_STATUSES.continuedAsNew]: 'Continued As New',
  [WORKFLOW_STATUSES.timedOut]: 'Timed Out',
} as const satisfies Record<WorkflowStatus, string>;
