import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  SummaryFieldsContainer: createStyled<'div', { $reverse?: boolean }>(
    'div',
    ({ $theme, $reverse }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale600,
      ...$theme.typography.LabelXSmall,
      ...($reverse
        ? {
            flexDirection: 'row-reverse',
            justifyContent: 'flex-end',
          }
        : {}),
    })
  ),
  SummaryFieldContainer: createStyled<'div', { $isNegative: boolean }>(
    'div',
    ({ $theme, $isNegative }: { $theme: Theme; $isNegative: boolean }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale300,
      color: $isNegative
        ? $theme.colors.contentNegative
        : $theme.colors.contentPrimary,
    })
  ),
};
