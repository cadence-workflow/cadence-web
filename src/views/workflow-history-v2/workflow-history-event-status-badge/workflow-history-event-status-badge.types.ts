import { type Hierarchy, type Color } from 'baseui/badge';
import { type IconProps } from 'baseui/icon';

import { type WorkflowEventStatus } from '../workflow-history-v2.types';

export type WorkflowHistoryEventStatusBadgeConfig = {
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }>;
  hierarchy: Hierarchy;
  color: Color;
};

export type Props = {
  status: WorkflowEventStatus;
  statusText?: string;
  isLoading?: boolean;
};
