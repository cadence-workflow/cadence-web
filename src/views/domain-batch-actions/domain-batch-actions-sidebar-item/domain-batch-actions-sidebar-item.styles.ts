import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  ListItem: createStyled<'li', { $isSelected: boolean; $isActive: boolean }>(
    'li',
    ({
      $theme,
      $isSelected,
      $isActive,
    }: {
      $theme: Theme;
      $isSelected: boolean;
      $isActive: boolean;
    }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale400,
      padding: $theme.sizing.scale400,
      borderRadius: $theme.borders.radius300,
      cursor: 'pointer',
      color: $isActive
        ? $theme.colors.contentPrimary
        : $theme.colors.contentSecondary,
      backgroundColor: $isSelected
        ? $theme.colors.backgroundSecondary
        : 'transparent',
      ':hover': {
        backgroundColor: $isSelected
          ? $theme.colors.backgroundSecondary
          : $theme.colors.backgroundTertiary,
      },
      ...$theme.typography.LabelXSmall,
    })
  ),
  TextContainer: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  }),
  SubLabel: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    color: $theme.colors.contentTertiary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    ...$theme.typography.ParagraphXSmall,
  })),
};
