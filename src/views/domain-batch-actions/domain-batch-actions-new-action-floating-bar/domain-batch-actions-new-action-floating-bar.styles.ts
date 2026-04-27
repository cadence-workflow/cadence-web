import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  actionButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.contentPrimary,
        color: $theme.colors.contentInversePrimary,
        ':hover': {
          backgroundColor: $theme.colors.contentSecondary,
        },
        ':focus': {
          backgroundColor: $theme.colors.contentSecondary,
        },
      }),
    },
    StartEnhancer: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        marginRight: $theme.sizing.scale200,
        fontSize: $theme.sizing.scale600,
      }),
    },
  } satisfies ButtonOverrides,
};

export const styled = {
  Container: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      position: 'absolute',
      bottom: $theme.sizing.scale800,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale600,
      padding: `${$theme.sizing.scale400} ${$theme.sizing.scale600}`,
      borderRadius: '999px',
      boxShadow: $theme.lighting.shadow600,
      zIndex: 1,
    })
  ),
  Summary: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      whiteSpace: 'nowrap',
    })
  ),
  Actions: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale400,
    })
  ),
};
