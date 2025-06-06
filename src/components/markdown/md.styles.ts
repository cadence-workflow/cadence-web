import { styled as createStyled } from 'baseui';

export const styled = {
  ViewContainer: createStyled('div', ({ $theme }) => ({
    flex: '1 0 150px',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '30px',
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius300,
    '& h1, h2, h3, h4, h5, h6': {
      lineHeight: $theme.typography.HeadingXSmall.lineHeight,
      marginTop: $theme.sizing.scale600,
      marginBottom: $theme.sizing.scale400,
      color: $theme.colors.contentPrimary,
    },
    '& p': {
      marginBottom: $theme.sizing.scale400,
    },
    '& pre': {
      fontFamily: $theme.typography.MonoLabelXSmall.fontFamily,
      backgroundColor: $theme.colors.backgroundAccentLight,
      padding: $theme.sizing.scale400,
    },
  })),
};
