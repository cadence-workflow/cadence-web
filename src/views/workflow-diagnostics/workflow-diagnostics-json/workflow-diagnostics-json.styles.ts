import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  jsonButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        width: $theme.sizing.scale950,
        height: $theme.sizing.scale950,
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }),
    },
  } satisfies ButtonOverrides,
};

export const styled = {
  ViewContainer: createStyled('div', ({ $theme }) => ({
    position: 'relative',
    gap: $theme.sizing.scale600,
    padding: $theme.sizing.scale600,
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius300,
  })),
  ButtonsContainer: createStyled('div', {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
  }),
};
