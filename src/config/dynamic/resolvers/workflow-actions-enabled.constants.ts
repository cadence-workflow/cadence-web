import { type WorkflowActionEnabledConfigValue } from './workflow-actions-enabled.types';

/**
 * Override this constant to define a set of reasons to disable workflow actions
 */
export const WORKFLOW_ACTIONS_DISABLED_REASONS = [
  'DISABLED_UNKNOWN',
] as const satisfies Array<`DISABLED_${string}`>;

export const WORKFLOW_ACTIONS_ENABLED_CONFIG_VALUES = {
  enabled: 'ENABLED',
  disabled_unknown: 'DISABLED_UNKNOWN',
} as const satisfies Record<string, WorkflowActionEnabledConfigValue>;
