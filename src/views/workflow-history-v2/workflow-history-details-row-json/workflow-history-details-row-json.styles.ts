import { styled as createStyled } from 'baseui';

export const styled = {
  JsonViewContainer: createStyled<'div', { $isNegative: boolean }>(
    'div',
    ({ $theme, $isNegative }) => ({
      color: $isNegative ? $theme.colors.contentNegative : '#A964F7',
      maxWidth: '360px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ...$theme.typography.MonoParagraphXSmall,
    })
  ),
};
