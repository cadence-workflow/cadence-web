import { styled as createStyled } from 'baseui';

export const styled = {
  IconContainer: createStyled<'div', { $hasHandler: boolean }>(
    'div',
    ({ $theme, $hasHandler }) => ({
      // Note: this green does not correspond to the Green available in Baseweb
      color: $hasHandler ? '#009A51' : $theme.colors.contentInverseSecondary,
      display: 'block',
    })
  ),
};
