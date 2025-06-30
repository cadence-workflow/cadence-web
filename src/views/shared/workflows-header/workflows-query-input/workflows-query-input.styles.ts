import { type Theme } from 'baseui';
import { styled as createStyled } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type InputOverrides } from 'baseui/input';
import { type StyleObject } from 'styletron-react';

export const styled = {
  QueryForm: createStyled('form', ({ $theme }) => ({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
  })),
};

export const overrides = {
  input: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        flexGrow: 1,
        height: $theme.sizing.scale950,
      }),
    },
    Input: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.MonoParagraphXSmall,
      }),
    },
  } satisfies InputOverrides,
  runButton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        whiteSpace: 'nowrap',
        height: $theme.sizing.scale950,
        ...$theme.typography.LabelSmall,
      }),
    },
  } satisfies ButtonOverrides,
};
