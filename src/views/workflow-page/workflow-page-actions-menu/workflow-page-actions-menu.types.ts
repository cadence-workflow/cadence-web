import { type IconProps } from 'baseui/icon';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';

export type WorkflowAction = {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }>;
  getIsEnabled: (workflow: DescribeWorkflowResponse) => boolean;
};

export type Props = {
  workflow: DescribeWorkflowResponse;
  isLoading: boolean;
  disableAll: boolean;
  onMenuItemSelect: (action: WorkflowAction) => void;
};
