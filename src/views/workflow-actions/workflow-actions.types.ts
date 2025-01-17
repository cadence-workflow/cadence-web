import { type IconProps } from 'baseui/icon';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';

export type WorkflowActionInputParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  // TODO: add input here for extended workflow actions
};

export type WorkflowAction<R> = {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }>;
  getIsEnabled: (workflow: DescribeWorkflowResponse) => boolean;
  apiRoute: string;
  getSuccessMessage: (
    result: R,
    inputParams: WorkflowActionInputParams
  ) => string;
};
