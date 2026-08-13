import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  PanelContainer: createStyled<'div', { $isNegative?: boolean }>(
    'div',
    ({ $theme, $isNegative }: { $theme: Theme; $isNegative?: boolean }) => ({
      padding: $theme.sizing.scale600,
      backgroundColor: $isNegative
        ? $theme.colors.backgroundNegativeLight
        : $theme.colors.backgroundSecondary,
      borderRadius: $theme.borders.radius300,
      height: '100%',
    })
  ),
  PanelLabel: createStyled<'div', { $isNegative?: boolean }>(
    'div',
    ({ $theme, $isNegative }: { $theme: Theme; $isNegative?: boolean }) => ({
      color: $isNegative
        ? $theme.colors.contentNegative
        : $theme.colors.contentPrimary,
      ...$theme.typography.LabelSmall,
    })
  ),
  PanelValue: createStyled<'div', { $isNegative?: boolean }>(
    'div',
    ({ $theme, $isNegative }: { $theme: Theme; $isNegative?: boolean }) => ({
      padding: `${$theme.sizing.scale500} 0`,
      color: $isNegative
        ? $theme.colors.contentNegative
        : $theme.colors.contentPrimary,
    })
  ),
};
