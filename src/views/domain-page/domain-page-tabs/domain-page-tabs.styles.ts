import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  PageTabsContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    marginTop: $theme.sizing.scale950,
  })),
};
