import { styled as createStyled, type Theme } from 'baseui';
export const styled = {
  GrayText: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    color: $theme.colors.contentTertiary,
  })),
};
