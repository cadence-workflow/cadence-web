import { type WorkflowActionsEnabledConfig } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';

export const DEFAULT_ACTIONS_ENABLED_CONFIG: WorkflowActionsEnabledConfig = {
  terminate: false,
  cancel: false,
};
