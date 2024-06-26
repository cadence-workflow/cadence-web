import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  MetadataContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    paddingTop: $theme.sizing.scale800,
  })),
};
