import { type WorkflowActionsEnabledConfig } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';
import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';

import { type WorkflowAction } from '../workflow-actions.types';

export type Props = {
  workflow: DescribeWorkflowResponse;
  actionsEnabledConfig: WorkflowActionsEnabledConfig;
  onActionSelect: (action: WorkflowAction<any>) => void;
};
