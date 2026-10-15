import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  Root: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphXSmall,
    color: $theme.colors.contentPrimary,
  })),
  CronExpression: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    fontFamily: $theme.typography.MonoParagraphXSmall.fontFamily,
    fontSize: $theme.typography.MonoParagraphXSmall.fontSize,
    lineHeight: 'inherit',
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius200,
    paddingLeft: $theme.sizing.scale100,
    paddingRight: $theme.sizing.scale100,
    whiteSpace: 'nowrap',
  })),
};
