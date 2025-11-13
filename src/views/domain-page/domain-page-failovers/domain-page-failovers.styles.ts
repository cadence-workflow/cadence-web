import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  FailoversContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    paddingTop: $theme.sizing.scale950,
  })),
};
