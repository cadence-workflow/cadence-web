import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import type { StyleObject } from 'styletron-react';

export const styled = {
  HelpMenuGroup: createStyled('div', ({ $theme }) => ({
    ':not(:first-child)': {
      paddingTop: $theme.sizing.scale100,
    },
    ':not(:last-child)': {
      borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
      paddingBottom: $theme.sizing.scale100,
    },
    display: 'flex',
    flexDirection: 'column',
  })),
  HelpMenuGroupTitle: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentInverseTertiary,
    paddingTop: $theme.sizing.scale300,
    paddingBottom: $theme.sizing.scale100,
    paddingLeft: $theme.sizing.scale300,
    paddingRight: $theme.sizing.scale300,
  })),
};

export const overrides = {
  popover: {
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        minWidth: '250px',
        ...$theme.typography.LabelSmall,
        backgroundColor: $theme.colors.backgroundPrimary,
        padding: $theme.sizing.scale200,
      }),
    },
  } satisfies PopoverOverrides,
};
