import { styled as createStyled, type Theme } from 'baseui';
import { type ProgressBarOverrides } from 'baseui/progress-bar';

import { type BatchActionStatus } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

import getStatusBackgroundColor from '../helpers/get-status-background-color';

export function getProgressBarOverrides(
  status: BatchActionStatus
): ProgressBarOverrides {
  return {
    Label: {
      style: ({ $theme }: { $theme: Theme }) => ({
        ...$theme.typography.LabelMedium,
        color: $theme.colors.contentPrimary,
      }),
    },
    BarProgress: {
      style: ({ $theme }: { $theme: Theme }) => ({
        backgroundColor: getStatusBackgroundColor(status, $theme),
      }),
    },
  };
}

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: $theme.sizing.scale300,
  })),
};
