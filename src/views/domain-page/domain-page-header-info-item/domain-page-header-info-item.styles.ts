import type { StyleObject } from 'styletron-react';

import { styled as createStyled, type Theme } from 'baseui';
import type { SkeletonOverrides } from 'baseui/skeleton/types';

export const styled = {
  ItemTitle: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentTertiary,
  })),
  Item: createStyled<'div', { $isString?: boolean }>(
    'div',
    ({ $theme, $isString }) => ({
      ...($isString && {
        color: $theme.colors.contentPrimary,
        ...$theme.typography.LabelXSmall,
        paddingTop: $theme.sizing.scale400,
      }),
    })
  ),
  ItemContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
  })),
};

export const overrides = {
  skeleton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale700,
        marginTop: $theme.sizing.scale300,
      }),
    },
  } satisfies SkeletonOverrides,
};
