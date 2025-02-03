import { type IconProps } from 'baseui/icon';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';

export type WorkflowActionInputParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  // TODO: add input here for extended workflow actions
};

export type WorkflowActionID = 'cancel' | 'terminate';

export type WorkflowAction<R> = {
  id: WorkflowActionID;
  label: string;
  subtitle: string;
  modal: {
    text: string;
    docsLink: {
      text: string;
      href: string;
    };
  };
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
