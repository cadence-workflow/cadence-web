import { styled as createStyled, type Theme } from 'baseui';
import type { BadgeOverrides } from 'baseui/badge';
import type { StyleObject } from 'styletron-react';

export const overrides = {
  badge: {
    Badge: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        color: $theme.colors.contentSecondary,
        backgroundColor: $theme.colors.backgroundSecondary,
        borderRadius: '20px',
        padding: `${$theme.sizing.scale0} ${$theme.sizing.scale300}`,
        ...$theme.typography.LabelXSmall,
      }),
    },
  } satisfies BadgeOverrides,
};

export const styled = {
  Text: createStyled(
    'span',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'block',
      maxWidth: $theme.sizing.scale4800,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    })
  ),
};
