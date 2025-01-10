import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  EndButtonsContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale300,
  })),
};
