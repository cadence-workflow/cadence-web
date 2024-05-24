import { styled as createStyled, type Theme } from 'baseui';
import type { ButtonOverrides } from 'baseui/button';
import { InputOverrides } from 'baseui/input';
import { type StyleObject } from 'styletron-react';

export const styled = {
  SearchInputContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale500,
      marginBottom: $theme.sizing.scale500,
      [$theme.mediaQuery.medium]: {
        flexDirection: 'row',
      },
    })
  ),
  SearchFiltersContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
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
  filtersButton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        whiteSpace: 'nowrap',
        height: $theme.sizing.scale950,
        ...$theme.typography.LabelSmall,
      }),
    },
  } satisfies ButtonOverrides,
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
  searchInput: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale950,
      }),
    },
    Input: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.ParagraphSmall,
      }),
    },
  } satisfies InputOverrides,
};
