import { type Theme, styled as createStyled } from 'baseui';

export const styled = {
  LabelContainer: createStyled<'div', { $isHighlighted?: boolean }>(
    'div',
    ({
      $theme,
      $isHighlighted,
    }: {
      $theme: Theme;
      $isHighlighted?: boolean;
    }) => ({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: $theme.sizing.scale500,
      ...$theme.typography.LabelSmall,
      ...($isHighlighted && { fontWeight: 700 }),
    })
  ),
};
