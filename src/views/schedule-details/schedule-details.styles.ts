import { styled as createStyled } from 'baseui';

export const styled = {
  DetailsSectionsContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale900,
  })),
};
