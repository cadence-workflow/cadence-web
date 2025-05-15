import { type Theme, styled as createStyled } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import type { StyleObject } from 'styletron-react';

export const overrides = {
  button: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
        justifyContent: 'flex-start',
        whiteSpace: 'nowrap',
      }),
    },
  } satisfies ButtonOverrides,
};

export const styled = {
  ExternalLinkButtonContent: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale500,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
  })),
};
