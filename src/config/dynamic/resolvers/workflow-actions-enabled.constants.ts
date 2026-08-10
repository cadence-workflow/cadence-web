import { type WorkflowActionsEnabledConfig } from './workflow-actions-enabled.types';

export const AUTHORIZED_WORKFLOW_ACTIONS_CONFIG: WorkflowActionsEnabledConfig =
  {
    terminate: 'ENABLED',
    cancel: 'ENABLED',
    restart: 'ENABLED',
    reset: 'ENABLED',
    signal: 'ENABLED',
    start: 'ENABLED',
  };

export const UNAUTHORIZED_WORKFLOW_ACTIONS_CONFIG: WorkflowActionsEnabledConfig =
  {
    terminate: 'DISABLED_UNAUTHORIZED',
    cancel: 'DISABLED_UNAUTHORIZED',
    restart: 'DISABLED_UNAUTHORIZED',
    reset: 'DISABLED_UNAUTHORIZED',
    signal: 'DISABLED_UNAUTHORIZED',
    start: 'DISABLED_UNAUTHORIZED',
  };

export const DEFAULT_DISABLED_WORKFLOW_ACTIONS_CONFIG: WorkflowActionsEnabledConfig =
  {
    terminate: 'DISABLED_DEFAULT',
    cancel: 'DISABLED_DEFAULT',
    restart: 'DISABLED_DEFAULT',
    reset: 'DISABLED_DEFAULT',
    signal: 'DISABLED_DEFAULT',
    start: 'DISABLED_DEFAULT',
  };
