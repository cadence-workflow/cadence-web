import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const styled = {
  NavBarContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      position: 'fixed',
      bottom: $theme.sizing.scale800,
      left: $theme.sizing.scale800,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: $theme.sizing.scale200,
      backgroundColor: $theme.colors.backgroundPrimary,
      borderRadius: '20px',
      boxShadow: $theme.lighting.shadow600,
      zIndex: 1,
    })
  ),
  SectionDivider: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      marginLeft: $theme.sizing.scale200,
      marginRight: $theme.sizing.scale200,
      height: $theme.sizing.scale500,
      width: '1px',
      backgroundColor: $theme.colors.backgroundTertiary,
    })
  ),
};

export const overrides = {
  navActionButton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        paddingTop: $theme.sizing.scale200,
        paddingBottom: $theme.sizing.scale200,
        paddingLeft: $theme.sizing.scale200,
        paddingRight: $theme.sizing.scale200,
      }),
    },
  } satisfies ButtonOverrides,
};
