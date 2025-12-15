import { styled as createStyled } from 'baseui';

export const styled = {
  TableTopSpacer: createStyled('div', ({ $theme }) => ({
    height: $theme.sizing.scale950,
  })),
};
