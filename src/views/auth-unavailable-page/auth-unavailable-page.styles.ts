import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Page: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale600,
      maxWidth: '560px',
      margin: '0 auto',
      paddingTop: $theme.sizing.scale950,
      paddingBottom: $theme.sizing.scale950,
      paddingLeft: $theme.sizing.scale600,
      paddingRight: $theme.sizing.scale600,
    })
  ),
  Title: createStyled(
    'h1',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.HeadingSmall,
      marginTop: 0,
      marginBottom: 0,
    })
  ),
  Description: createStyled(
    'p',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphMedium,
      color: $theme.colors.contentSecondary,
      marginTop: 0,
      marginBottom: 0,
    })
  ),
};
