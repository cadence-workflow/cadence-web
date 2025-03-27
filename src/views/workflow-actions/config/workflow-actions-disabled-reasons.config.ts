import { type WorkflowActionDisabledValue } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';

const WORKFLOW_ACTIONS_DISABLED_REASONS_CONFIG = {
  DISABLED_DEFAULT: 'Workflow action has been disabled',
  DISABLED_UNAUTHORIZED: 'Not authorized to perform this action',
} as const satisfies Record<WorkflowActionDisabledValue, string>;

export default WORKFLOW_ACTIONS_DISABLED_REASONS_CONFIG;
