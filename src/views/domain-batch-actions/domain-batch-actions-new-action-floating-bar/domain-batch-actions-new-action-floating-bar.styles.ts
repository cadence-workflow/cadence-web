import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  actionButton: {
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
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale600,
      padding: `${$theme.sizing.scale400} ${$theme.sizing.scale600}`,
      borderRadius: '999px',
      boxShadow: $theme.lighting.shadow600,
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
