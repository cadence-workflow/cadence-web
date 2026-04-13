import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';

export const overrides = {
  newActionButton: {
    BaseButton: {
      style: ({ $theme: _theme }: { $theme: Theme }) => ({
        justifyContent: 'flex-start',
        width: '100%',
      }),
    },
  } satisfies ButtonOverrides,
};

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    padding: $theme.sizing.scale600,
    gap: $theme.sizing.scale400,
  })),
  SectionLabel: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentSecondary,
    paddingTop: $theme.sizing.scale300,
    paddingLeft: $theme.sizing.scale500,
  })),
  List: createStyled('ul', () => ({
    listStyle: 'none',
    margin: 0,
    padding: 0,
  })),
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
};
