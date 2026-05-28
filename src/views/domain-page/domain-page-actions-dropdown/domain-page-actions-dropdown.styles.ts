import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import type { StyleObject } from 'styletron-react';

export const styled = {
  MenuItemsContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: $theme.sizing.scale200,
  })),
};

export const overrides = {
  popover: {
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundPrimary,
      }),
    },
  } satisfies PopoverOverrides,
};
