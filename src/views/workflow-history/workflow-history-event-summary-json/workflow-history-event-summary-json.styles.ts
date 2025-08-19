import { styled as createStyled } from 'baseui';

export const styled = {
  JsonViewContainer: createStyled<'div', { $isNegative: boolean }>(
    'div',
    ({ $theme, $isNegative }) => ({
      padding: `${$theme.sizing.scale0} ${$theme.sizing.scale300}`,
      color: $isNegative ? $theme.colors.contentNegative : '#A964F7',
      backgroundColor: $isNegative
        ? $theme.colors.backgroundNegativeLight
        : $theme.colors.backgroundSecondary,
      borderRadius: $theme.borders.radius300,
      maxHeight: $theme.sizing.scale800,
      maxWidth: '360px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ...$theme.typography.MonoParagraphXSmall,
    })
  ),
};
