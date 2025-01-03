import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  Title: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.HeadingXSmall,
  })),
  Content: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  }),
  Detail: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphLarge,
    color: $theme.colors.contentSecondary,
  })),
  LinksContainer: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }),
  LinkContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphLarge,
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale200,
  })),
};
