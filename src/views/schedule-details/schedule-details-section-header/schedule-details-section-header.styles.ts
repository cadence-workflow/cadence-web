import { type Theme, styled as createStyled } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const styled = {
  HeaderContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: $theme.sizing.scale400,
  })),
  Title: createStyled('h2', ({ $theme }) => ({
    ...$theme.typography.LabelSmall,
    marginTop: 0,
    marginBottom: 0,
  })),
};

export const overrides = {
  collapseButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        width: $theme.sizing.scale850,
        height: $theme.sizing.scale850,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: $theme.borders.radius300,
      }),
    },
  } satisfies ButtonOverrides,
};
