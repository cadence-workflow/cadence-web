import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  TempContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.MonoParagraphXSmall,
    padding: $theme.sizing.scale300,
    ...$theme.borders.border100,
  })),
};
