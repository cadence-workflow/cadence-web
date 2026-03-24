import type { Theme } from 'baseui';
import type { BadgeOverrides } from 'baseui/badge';
import type { StyleObject } from 'styletron-react';

export const overrides = {
  badge: {
    Badge: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        color: $theme.colors.contentOnColor,
        backgroundColor: $theme.colors.accent,
        borderRadius: '50%',
        minWidth: $theme.sizing.scale700,
        ...$theme.typography.LabelXSmall,
        justifyContent: 'center',
      }),
    },
  } satisfies BadgeOverrides,
};
