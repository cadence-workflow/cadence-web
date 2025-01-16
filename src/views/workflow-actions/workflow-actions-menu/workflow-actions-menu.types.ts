import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';

import { type WorkflowAction } from '../workflow-actions.types';

export type Props = {
  workflow: DescribeWorkflowResponse;
  onActionSelect: (action: WorkflowAction) => void;
};
