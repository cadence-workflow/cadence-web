import type { Theme } from 'baseui';
import type { StyleObject } from 'styletron-react';
import type { BadgeOverrides } from 'baseui/badge';

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
};
