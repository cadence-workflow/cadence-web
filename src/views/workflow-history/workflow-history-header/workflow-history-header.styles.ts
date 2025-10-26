import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  HeaderWrapper: createStyled<'div', { $isSticky?: boolean }>(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      paddingTop: $theme.sizing.scale600,
      paddingBottom: $theme.sizing.scale600,
      marginTop: `-${$theme.sizing.scale600}`,
      backgroundColor: $theme.colors.backgroundPrimary,
    })
  ),
  Header: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: $theme.sizing.scale500,
    })
  ),
  Actions: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale500,
    })
  ),
};

export const overrides = {
  toggleButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }) => ({
        paddingLeft: $theme.sizing.scale500,
        paddingRight: $theme.sizing.scale500,
      }),
    },
  },
};
