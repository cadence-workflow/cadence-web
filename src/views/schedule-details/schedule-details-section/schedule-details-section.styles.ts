import { styled as createStyled } from 'baseui';

export const styled = {
  Section: createStyled('section', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
  })),
};
