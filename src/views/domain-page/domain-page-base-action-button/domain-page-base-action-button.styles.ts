import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import type { StyleObject } from 'styletron-react';

export const styled = {
  MenuItemContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale500,
    alignItems: 'center',
  })),
  MenuItemLabel: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelSmall,
  })),
};

export const overrides = {
  button: {
    BaseButton: {
      style: {
        width: '100%',
        justifyContent: 'flex-start',
      } satisfies StyleObject,
    },
  } satisfies ButtonOverrides,
};
