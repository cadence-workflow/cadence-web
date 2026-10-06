import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Page: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      boxSizing: 'border-box',
      backgroundColor: $theme.colors.backgroundSecondary,
      paddingTop: $theme.sizing.scale800,
      paddingBottom: $theme.sizing.scale800,
      paddingLeft: $theme.sizing.scale600,
      paddingRight: $theme.sizing.scale600,
    })
  ),
  Card: createStyled(
    'main',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: $theme.sizing.scale600,
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '480px',
      padding: $theme.sizing.scale1000,
      borderRadius: $theme.borders.radius400,
      backgroundColor: $theme.colors.backgroundPrimary,
    })
  ),
  Title: createStyled(
    'h1',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.HeadingSmall,
      marginTop: 0,
      marginBottom: 0,
      textAlign: 'center',
    })
  ),
  Description: createStyled(
    'p',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphMedium,
      color: $theme.colors.contentSecondary,
      marginTop: 0,
      marginBottom: 0,
      textAlign: 'center',
    })
  ),
};
