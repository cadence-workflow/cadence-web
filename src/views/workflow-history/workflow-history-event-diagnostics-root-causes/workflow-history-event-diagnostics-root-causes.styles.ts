import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  RootCausesList: createStyled('ul', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale600,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    width: '100%',
  })),
  RootCauseItem: createStyled('li', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale300,
  })),
  RootCauseHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: $theme.sizing.scale300,
  })),
  RootCauseBullet: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    height: String($theme.typography.ParagraphSmall.lineHeight),
    color: $theme.colors.contentTertiary,
  })),
  RootCauseType: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphSmall,
    color: $theme.colors.contentPrimary,
  })),
  RootCauseMetadata: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    paddingLeft: $theme.sizing.scale600,
    borderLeft: `${$theme.sizing.scale0} solid ${$theme.colors.borderOpaque}`,
  })),
};
