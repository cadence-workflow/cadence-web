import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  QueryCaption: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphXSmall,
    color: $theme.colors.contentSecondary,
    marginTop: $theme.sizing.scale100,
  })),
  QueryError: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphXSmall,
    color: $theme.colors.contentNegative,
    marginTop: $theme.sizing.scale100,
  })),
};
