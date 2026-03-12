import { styled as createStyled, type Theme } from 'baseui';
import type { SelectOverrides } from 'baseui/select';
import type { StyleObject } from 'styletron-react';

export const styled = {
  ItemLabel: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentPrimary,
    paddingTop: $theme.sizing.scale400,
  })),
};

export const overrides = {
  select: {
    Root: {
      style: ({
        $theme,
        $noSpacing,
      }: {
        $theme: Theme;
        $noSpacing?: boolean;
      }): StyleObject => ({
        ...($noSpacing ? {} : { paddingTop: $theme.sizing.scale100 }),
        width: 'fit-content',
        maxWidth: '200px',
      }),
    },
    ControlContainer: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale850,
        alignItems: 'center',
      }),
    },
  } satisfies SelectOverrides,
};
