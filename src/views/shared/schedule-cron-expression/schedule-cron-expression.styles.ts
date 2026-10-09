import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  Root: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphXSmall,
    color: $theme.colors.contentPrimary,
    display: 'flex',
    gap: $theme.sizing.scale200,
  })),
  CronExpression: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.MonoParagraphXSmall,
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius200,
    paddingLeft: $theme.sizing.scale100,
    paddingRight: $theme.sizing.scale100,
    alignSelf: 'flex-start',
    whiteSpace: 'nowrap',
  })),
};
