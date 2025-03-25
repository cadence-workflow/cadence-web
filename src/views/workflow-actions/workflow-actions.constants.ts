import { type WorkflowActionRunStatus } from './workflow-actions.types';

export const WORKFLOW_ACTION_RUN_STATUS_VALUES = [
  'RUNNABLE',
  'NOT_RUNNABLE_WORKFLOW_CLOSED',
] as const satisfies Array<string>;

export const WORKFLOW_ACTION_RUN_STATUSES = {
  runnable: 'RUNNABLE',
  not_runnable_workflow_closed: 'NOT_RUNNABLE_WORKFLOW_CLOSED',
} as const satisfies Record<string, WorkflowActionRunStatus>;
