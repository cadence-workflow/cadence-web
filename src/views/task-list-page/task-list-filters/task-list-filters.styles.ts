import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  FiltersContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    marginTop: $theme.sizing.scale600,
  })),
};
