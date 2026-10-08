import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  Root: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale200,
  })),
  CronExpression: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    fontFamily: $theme.typography.MonoParagraphXSmall.fontFamily,
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius200,
    paddingLeft: $theme.sizing.scale100,
    paddingRight: $theme.sizing.scale100,
    whiteSpace: 'nowrap',
  })),
};
