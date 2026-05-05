import { styled as createStyled, type Theme } from 'baseui';
import type { SkeletonOverrides } from 'baseui/skeleton/types';
import type { StyleObject } from 'styletron-react';

export const styled = {
  ItemTitle: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentTertiary,
  })),
  Item: createStyled<'div', { $isString?: boolean }>(
    'div',
    ({ $theme, $isString }) => ({
      paddingTop: $theme.sizing.scale300,
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      ...($isString && {
        ...$theme.typography.LabelSmall,
      }),
    })
  ),
  ItemContainer: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
  }),
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
