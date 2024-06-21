import { styled as createStyled, withStyle } from 'baseui';
import { StyledLink } from 'baseui/link';

export const styled = {
  EndMessageContainer: createStyled<'div', { $isError?: boolean }>(
    'div',
    ({ $theme, $isError }) => ({
      ...$theme.typography.LabelSmall,
      color: $isError
        ? $theme.colors.contentNegative
        : $theme.colors.contentTertiary,
    })
  ),
  RetryLink: withStyle(StyledLink, ({ $theme }) => ({
    color: $theme.colors.contentNegative,
    cursor: 'pointer',
  })),
};
