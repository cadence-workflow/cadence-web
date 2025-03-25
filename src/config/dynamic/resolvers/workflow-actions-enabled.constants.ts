import { type WorkflowActionEnabledConfigValue } from './workflow-actions-enabled.types';

/**
 * Override these constants to define a set of reasons to disable workflow actions
 */
export const WORKFLOW_ACTIONS_DISABLED_REASONS = [
  'DISABLED_UNKNOWN',
  'DISABLED_UNAUTHORIZED',
] as const satisfies Array<`DISABLED_${string}`>;

export const WORKFLOW_ACTIONS_ENABLED_CONFIG_VALUES = {
  enabled: 'ENABLED',
  disabled_unknown: 'DISABLED_UNKNOWN',
  disabled_unauthorized: 'DISABLED_UNAUTHORIZED',
} as const satisfies Record<string, WorkflowActionEnabledConfigValue>;
