import { styled as createStyled } from 'baseui';

export const styled = {
  EndMessageContainer: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelSmall,
    color: $theme.colors.contentTertiary,
  })),
};
