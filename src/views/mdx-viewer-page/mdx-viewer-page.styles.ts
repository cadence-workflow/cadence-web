import { type Theme, styled as createStyled } from 'baseui';

import { getMediaQueryMargins } from '@/utils/media-query/get-media-queries-margins';

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    width: '100%',
    margin: '0 auto',
    paddingLeft: $theme.sizing.scale600,
    paddingRight: $theme.sizing.scale600,
    paddingTop: $theme.sizing.scale800,
    paddingBottom: $theme.sizing.scale800,
    ...getMediaQueryMargins($theme, (margin) => ({
      maxWidth: `${$theme.grid.maxWidth + 2 * margin}px`,
      paddingRight: `${margin}px`,
      paddingLeft: `${margin}px`,
    })),
  })),

  Nav: createStyled('nav', ({ $theme }: { $theme: Theme }) => ({
    marginBottom: $theme.sizing.scale800,
    paddingBottom: $theme.sizing.scale600,
    borderBottom: `1px solid ${$theme.colors.backgroundTertiary}`,
  })),

  BackLink: createStyled('a', ({ $theme }: { $theme: Theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: $theme.sizing.scale400,
    textDecoration: 'none',
    ':hover': {
      opacity: 0.7,
    },
  })),

  BackLinkIcon: createStyled('svg', () => ({
    display: 'flex',
    height: '24px',
  })),

  Title: createStyled('h2', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.HeadingLarge,
    margin: 0,
  })),

  Article: createStyled('article', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphMedium,
  })),
};
