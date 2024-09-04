import type { Theme } from 'baseui';

import { type WorkflowEventStatusBadgeSize } from '../workflow-history-event-status-badge.types';

export default function getBadgeContainerSize(
  theme: Theme,
  size: WorkflowEventStatusBadgeSize
): string {
  const sizeMap: Record<WorkflowEventStatusBadgeSize, string> = {
    small: theme.sizing.scale600,
    medium: theme.sizing.scale800,
  };

  return sizeMap[size];
}
