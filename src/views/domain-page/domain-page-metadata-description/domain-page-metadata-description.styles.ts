import { styled as createStyled } from 'baseui';

export const styled = {
  DescriptionContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: $theme.sizing.scale500,
  })),
  DescriptionPlaceholder: createStyled('div', ({ $theme }) => ({
    color: $theme.colors.contentTertiary,
  })),
};
