import { styled as createStyled } from 'baseui';

export const styled = {
  Container: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale200,
  })),
  IconWrapper: createStyled('div', () => ({
    display: 'flex',
    cursor: 'pointer',
  })),
};
