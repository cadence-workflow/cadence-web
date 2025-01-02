import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  PanelContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    gap: $theme.sizing.scale600,
    padding: `${$theme.sizing.scale900} ${$theme.sizing.scale600}`,
  })),
  TopSpacer: createStyled('div', {
    flex: '1 1 35%',
  }),
  BottomSpacer: createStyled('div', {
    flex: '1 1 65%',
  }),
  Title: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.HeadingXSmall,
  })),
  Content: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }),
  Subtitle: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphLarge,
    color: $theme.colors.contentSecondary,
  })),
};
