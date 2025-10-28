import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Container: createStyled(
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
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: $theme.sizing.scale500,
      [$theme.mediaQuery.medium]: {
        alignItems: 'center',
        flexDirection: 'row',
      },
    })
  ),
  Actions: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      gap: $theme.sizing.scale500,
      [$theme.mediaQuery.medium]: {
        flexDirection: 'row',
      },
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
