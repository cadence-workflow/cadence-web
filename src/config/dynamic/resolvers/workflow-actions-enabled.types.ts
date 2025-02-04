import { type WorkflowActionID } from '@/views/workflow-actions/workflow-actions.types';

export type WorkflowActionsEnabledResolverParams = {
  domain: string;
  cluster: string;
};

export type WorkflowActionsEnabledConfig = Record<WorkflowActionID, boolean>;
