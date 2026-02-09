import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: $theme.sizing.scale100,
  })),
  CronExpression: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    fontFamily: $theme.typography.MonoParagraphXSmall.fontFamily,
  })),
  CronDescription: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    color: $theme.colors.contentSecondary,
  })),
};
