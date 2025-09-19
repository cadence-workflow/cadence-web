import { styled as createStyled, type Theme } from 'baseui';
import { type CheckboxOverrides } from 'baseui/checkbox';
import { type StyleObject } from 'styletron-react';

export const styled = {
  MenuContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
    paddingTop: $theme.sizing.scale600,
    paddingBottom: $theme.sizing.scale400,
    backgroundColor: $theme.colors.backgroundPrimary,
    borderRadius: $theme.borders.radius400,
  })),
  SelectAllContainer: createStyled('div', ({ $theme }) => ({
    padding: `0 ${$theme.sizing.scale400}`,
  })),
  OptionsContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
    borderTop: `1px solid ${$theme.colors.borderOpaque}`,
    borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
    padding: $theme.sizing.scale400,
  })),
  ActionButtonsContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `0 ${$theme.sizing.scale400}`,
    gap: $theme.sizing.scale300,
  })),
};

export const overrides = {
  checkbox: {
    Root: {
      style: {
        alignItems: 'center',
      },
    },
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
      }),
    },
  } satisfies CheckboxOverrides,
};
