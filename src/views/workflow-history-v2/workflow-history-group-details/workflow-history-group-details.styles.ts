import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonGroupProps } from 'baseui/button-group';
import { type StyleObject } from 'styletron-react';

export const styled = {
  GroupDetailsContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale500,
      alignItems: 'stretch',
    })
  ),
  ActionsRow: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: $theme.sizing.scale400,
  })),
  ExtraActions: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale100,
    alignItems: 'center',
  })),
};

export const overrides = {
  buttonGroup: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        gap: $theme.sizing.scale0,
      }),
    },
  } satisfies ButtonGroupProps['overrides'],
};
