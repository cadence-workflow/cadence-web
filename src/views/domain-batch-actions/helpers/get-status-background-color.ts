import { type Theme } from 'baseui';

import { type BatchActionStatus } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

export default function getStatusBackgroundColor(
  status: BatchActionStatus,
  theme: Theme
): string {
  switch (status) {
    case 'RUNNING':
      return theme.colors.backgroundAccent;
    case 'COMPLETED':
      return theme.colors.backgroundPositive;
    case 'ABORTED':
      return theme.colors.backgroundNegative;
    case 'FAILED':
      return theme.colors.backgroundWarning;
  }
}
