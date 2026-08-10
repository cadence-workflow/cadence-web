import type { Theme } from 'baseui';
import type { BadgeOverrides } from 'baseui/badge';
import type { StyleObject } from 'styletron-react';

export const overrides = {
  badge: {
    Badge: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        color: $theme.colors.contentOnColor,
        backgroundColor: $theme.colors.accent,
        borderRadius: '20px',
        padding: `${$theme.sizing.scale0} ${$theme.sizing.scale300}`,
        ...$theme.typography.LabelXSmall,
      }),
    },
  } satisfies BadgeOverrides,
};
