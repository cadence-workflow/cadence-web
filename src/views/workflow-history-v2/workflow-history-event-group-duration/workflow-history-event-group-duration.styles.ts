import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  DurationContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale100,
  })),
};
