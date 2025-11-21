import { type Theme, styled as createStyled } from 'baseui';
import type { FormControlOverrides } from 'baseui/form-control/types';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  formControl: {
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
      }),
    },
    ControlContainer: {
      style: (): StyleObject => ({
        margin: '0px',
      }),
    },
  } satisfies FormControlOverrides,
};

export const styled = {
  FormControlContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale300,
  })),
  TagsContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: $theme.sizing.scale200,
    flexFlow: 'row wrap',
  })),
};
