import { styled as createStyled, type Theme } from 'baseui';
import { type SnackbarElementOverrides } from 'baseui/snackbar';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Container: createStyled('div', () => ({
    display: 'flex',
    flexDirection: 'row',
  })),
  Sidebar: createStyled('aside', () => ({
    width: '20%',
    minWidth: '180px',
    flexShrink: 0,
  })),
  DetailPanel: createStyled('main', ({ $theme }: { $theme: Theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: $theme.sizing.scale600,
  })),
};

export const overrides = {
  errorSnackbar: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.contentNegative,
      }),
    },
  } satisfies SnackbarElementOverrides,
};
