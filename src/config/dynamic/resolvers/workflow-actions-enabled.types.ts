import { type WorkflowActionID } from '@/views/workflow-actions/workflow-actions.types';

import { type WORKFLOW_ACTIONS_DISABLED_REASONS } from './workflow-actions-enabled.constants';

export type WorkflowActionsEnabledResolverParams = {
  domain: string;
  cluster: string;
};

export type WorkflowActionDisabledReason =
  (typeof WORKFLOW_ACTIONS_DISABLED_REASONS)[number];

export type WorkflowActionEnabledConfigValue =
  | 'ENABLED'
  | WorkflowActionDisabledReason;

export type WorkflowActionsEnabledConfig = Record<
  WorkflowActionID,
  WorkflowActionEnabledConfigValue
>;
