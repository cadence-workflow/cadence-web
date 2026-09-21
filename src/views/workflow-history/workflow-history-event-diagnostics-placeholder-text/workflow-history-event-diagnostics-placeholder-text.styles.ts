import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  PlaceholderText: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    color: $theme.colors.contentTertiary,
    fontStyle: 'italic',
  })),
};
