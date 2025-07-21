import { styled as createStyled } from 'baseui';
import { type Theme } from 'baseui/theme';

export const styled = {
  ButtonsContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    gap: $theme.sizing.scale300,
  })),
};
