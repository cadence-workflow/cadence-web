import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  CheckboxCell: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    width: $theme.sizing.scale800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: $theme.sizing.scale400,
    paddingBottom: $theme.sizing.scale400,
  })),
};
