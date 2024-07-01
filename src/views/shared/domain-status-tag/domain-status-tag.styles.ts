import { type Theme } from 'baseui';
import type { TagOverrides } from 'baseui/tag/types';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  tag: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        color: $theme.colors.contentPrimary,
        backgroundColor: $theme.colors.backgroundTertiary,
        borderColor: $theme.colors.backgroundTertiary,
        height: $theme.sizing.scale700,
        borderRadius: $theme.borders.radius400,
        margin: 0,
      }),
    },
    Text: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: $theme.sizing.scale100,
        ...$theme.typography.LabelXSmall,
      }),
    },
  } satisfies TagOverrides,
};
