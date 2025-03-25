import { type WorkflowActionDisabledReason } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';

import { type WorkflowActionRunStatus } from '../workflow-actions.types';

/**
 * Override these constants to define labels for disabled workflow actions
 */
export const WORKFLOW_ACTION_DISABLED_LABELS = {
  DISABLED_UNKNOWN: 'Workflow action has been disabled',
  DISABLED_UNAUTHORIZED: 'Not authorized to perform this action',
} as const satisfies Record<WorkflowActionDisabledReason, string>;

export const WORKFLOW_ACTION_RUN_STATUS_LABELS = {
  RUNNABLE: 'Runnable',
  NOT_RUNNABLE_WORKFLOW_CLOSED: 'Workflow is already closed',
} as const satisfies Record<WorkflowActionRunStatus, string>;
