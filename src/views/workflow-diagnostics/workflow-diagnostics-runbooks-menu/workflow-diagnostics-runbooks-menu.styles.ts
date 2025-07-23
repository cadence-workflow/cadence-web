import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type PopoverOverrides } from 'baseui/popover';
import type { StyleObject } from 'styletron-react';

export const styled = {
  MenuItem: createStyled('div', ({ $theme }) => ({
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
  MenuItemContent: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale500,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
  })),
  SingleRunbookLink: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelXSmall,
    display: 'flex',
    gap: $theme.sizing.scale200,
    alignItems: 'center',
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
  menuItemButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
        justifyContent: 'flex-start',
        whiteSpace: 'nowrap',
      }),
    },
  } satisfies ButtonOverrides,
  runbooksButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale800,
      }),
    },
  } satisfies ButtonOverrides,
};
