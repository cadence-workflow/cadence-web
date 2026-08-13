import { type Theme } from 'baseui';
import type { TagOverrides } from 'baseui/tag/types';
import { type StyleObject } from 'styletron-react';

import { type BatchActionStatus } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

import getStatusBackgroundColor from '../helpers/get-status-background-color';

export function getTagOverrides(
  status: BatchActionStatus,
  theme: Theme
): TagOverrides {
  const backgroundColor = getStatusBackgroundColor(status, theme);

  return {
    Root: {
      style: (): StyleObject => ({
        backgroundColor,
        borderColor: backgroundColor,
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
