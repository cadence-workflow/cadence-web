import type { Theme } from 'baseui';
import type { BadgeOverrides } from 'baseui/badge';
import { type SkeletonOverrides } from 'baseui/skeleton/types';
import type { StyleObject } from 'styletron-react';

export const overrides = {
  badge: {
    Badge: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        color: $theme.colors.contentPrimary,
        backgroundColor: $theme.colors.backgroundTertiary,
        borderRadius: '20px',
        padding: `${$theme.sizing.scale0} ${$theme.sizing.scale300}`,
        ...$theme.typography.LabelXSmall,
      }),
    },
  } satisfies BadgeOverrides,
  skeleton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale700,
        width: $theme.sizing.scale1000,
        borderRadius: $theme.borders.radius400,
        flexShrink: 0,
      }),
    },
  } satisfies SkeletonOverrides,
};
