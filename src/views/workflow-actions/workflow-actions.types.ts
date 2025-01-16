import { type IconProps } from 'baseui/icon';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';

export type WorkflowAction = {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }>;
  getIsEnabled: (workflow: DescribeWorkflowResponse) => boolean;
  // Add a field for the endpoint to call
};
