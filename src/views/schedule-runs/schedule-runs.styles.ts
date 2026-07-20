import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Root: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale900,
    })
  ),
  HeaderToolbar: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  })),
  SearchSlot: createStyled('div', () => ({
    flexGrow: 1,
    minWidth: 0,
  })),
};
