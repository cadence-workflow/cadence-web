import { type Theme } from 'baseui';
import { styled as createStyled } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import type { FormControlOverrides } from 'baseui/form-control/types';
import { type StyleObject } from 'styletron-react';

export const styled = {
  FiltersContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: $theme.sizing.scale500,
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    marginTop: $theme.sizing.scale950,
    marginBottom: $theme.sizing.scale900,
  })),
  FilterContainer: createStyled('div', ({ $theme }) => ({
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0',
    [$theme.mediaQuery.medium]: {
      alignSelf: 'flex-start',
    },
  })),
};

export const overrides = {
  comboboxFormControl: {
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelXSmall,
      }),
    },
    ControlContainer: {
      style: (): StyleObject => ({
        margin: '0px',
      }),
    },
  } satisfies FormControlOverrides,
  clearFiltersButton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        whiteSpace: 'nowrap',
        flexGrow: 2,
        height: $theme.sizing.scale950,
        [$theme.mediaQuery.medium]: {
          flexGrow: 0,
          alignSelf: 'flex-end',
        },
      }),
    },
  } satisfies ButtonOverrides,
};
