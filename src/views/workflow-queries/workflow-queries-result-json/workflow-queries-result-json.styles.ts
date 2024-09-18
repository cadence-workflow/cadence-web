import { styled as createStyled } from 'baseui';

export const styled = {
  ViewContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: $theme.sizing.scale600,
    padding: $theme.sizing.scale600,
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius300,
  })),
};
