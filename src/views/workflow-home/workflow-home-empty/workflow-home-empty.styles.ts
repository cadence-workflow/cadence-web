import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Description: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: $theme.sizing.scale600,
    })
  ),
  Snippet: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      position: 'relative',
      maxWidth: '100%',
      textAlign: 'left',
      backgroundColor: $theme.colors.backgroundSecondary,
      borderRadius: $theme.borders.radius300,
    })
  ),
  Code: createStyled(
    'pre',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.MonoParagraphSmall,
      margin: 0,
      padding: $theme.sizing.scale600,
      paddingRight: $theme.sizing.scale1200,
      overflowX: 'auto',
      color: $theme.colors.contentPrimary,
    })
  ),
  CopyButtonContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      position: 'absolute',
      top: $theme.sizing.scale300,
      right: $theme.sizing.scale300,
    })
  ),
};
