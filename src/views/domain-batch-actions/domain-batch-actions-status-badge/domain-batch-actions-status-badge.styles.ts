import { type Theme } from 'baseui';
import type { TagOverrides } from 'baseui/tag/types';
import { type StyleObject } from 'styletron-react';

import { type BatchActionStatus } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

export function getTagOverrides(
  status: BatchActionStatus,
  theme: Theme
): TagOverrides {
  const colors = {
    RUNNING: {
      background: theme.colors.backgroundAccent,
      border: theme.colors.backgroundAccent,
    },
    COMPLETED: {
      background: theme.colors.backgroundPositive,
      border: theme.colors.backgroundPositive,
    },
    ABORTED: {
      background: theme.colors.backgroundNegative,
      border: theme.colors.backgroundNegative,
    },
    FAILED: {
      background: theme.colors.backgroundWarning,
      border: theme.colors.backgroundWarning,
    },
  }[status];

  return {
    Root: {
      style: (): StyleObject => ({
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderRadius: theme.borders.radius200,
        marginLeft: 0,
      }),
    },
    Text: {
      style: (): StyleObject => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: theme.sizing.scale200,
        ...theme.typography.LabelSmall,
        color:
          status === 'FAILED'
            ? theme.colors.contentPrimary
            : theme.colors.contentOnColor,
      }),
    },
  };
}
