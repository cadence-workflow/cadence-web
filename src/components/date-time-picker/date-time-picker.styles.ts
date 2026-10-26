import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  PopoverBody: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
    padding: $theme.sizing.scale500,
    backgroundColor: $theme.colors.backgroundPrimary,
  })),
};
