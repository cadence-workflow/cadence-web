import { type WorkflowActionDisabledReason } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';

export const WORKFLOW_ACTIONS_DISABLED_LABELS = {
  DISABLED_UNKNOWN: 'Workflow action has been disabled',
} as const satisfies Record<WorkflowActionDisabledReason, string>;
