import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  SettingsContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    paddingTop: $theme.sizing.scale950,
  })),
};
