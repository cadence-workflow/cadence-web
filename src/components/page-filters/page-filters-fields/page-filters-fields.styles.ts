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
        alignItems: 'flex-end',
      },
    })
  ),
  SearchFilterContainer: createStyled<'div', { $mini: boolean | undefined }>(
    'div',
    ({ $mini }) => ({
      flexGrow: $mini ? 0 : 2,
      flexBasis: 'fit-content',
    })
  ),
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
        },
      }),
    },
  } satisfies ButtonOverrides,
};
