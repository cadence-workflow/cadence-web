import type { Theme } from 'baseui';

import { type WorkflowEventStatusBadgeSize } from '../workflow-history-event-status-badge.types';

export default function getBadgeIconSize(
  theme: Theme,
  size: WorkflowEventStatusBadgeSize
): string {
  const iconSizeMap: Record<WorkflowEventStatusBadgeSize, string> = {
    small: theme.sizing.scale400,
    medium: theme.sizing.scale550,
  };

  return iconSizeMap[size];
}
