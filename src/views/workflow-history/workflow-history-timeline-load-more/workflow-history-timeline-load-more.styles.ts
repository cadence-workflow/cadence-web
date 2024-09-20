import { styled as createStyled, withStyle } from 'baseui';
import { StyledLink } from 'baseui/link';

export const styled = {
  EndMessageContainer: createStyled<'div', { $isError?: boolean }>(
    'div',
    ({ $theme, $isError }) => ({
      margin: '0 auto',
      padding: $theme.sizing.scale600,
      ...$theme.typography.LabelSmall,
      color: $isError
        ? $theme.colors.contentNegative
        : $theme.colors.contentTertiary,
    })
  ),
  SpinnerContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    padding: $theme.sizing.scale600,
  })),
  RetryLink: withStyle(StyledLink, ({ $theme }) => ({
    color: $theme.colors.contentNegative,
    cursor: 'pointer',
  })),
};
