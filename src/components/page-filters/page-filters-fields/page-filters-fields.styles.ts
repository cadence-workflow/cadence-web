import { styled as createStyled, type Theme } from 'baseui';
import type { ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const styled = {
  SearchFiltersContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      gap: $theme.sizing.scale500,
      marginBottom: $theme.sizing.scale700,
      [$theme.mediaQuery.medium]: {
        flexDirection: 'row',
      },
    })
  ),
  SearchFilterContainer: createStyled('div', {
    flexGrow: 2,
    flexBasis: 0,
  }),
};

export const overrides = {
  clearFiltersButton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        whiteSpace: 'nowrap',
        flexGrow: 2,
        height: $theme.sizing.scale950,
        [$theme.mediaQuery.medium]: {
          flexGrow: 0,
          alignSelf: 'flex-end',
          marginTop: $theme.sizing.scale700,
        },
      }),
    },
  } satisfies ButtonOverrides,
};
