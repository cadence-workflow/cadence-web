import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Root: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale900,
      marginTop: $theme.sizing.scale950,
      marginBottom: $theme.sizing.scale900,
    })
  ),
  Toolbar: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: $theme.sizing.scale600,
    })
  ),
  ToolbarTitle: createStyled(
    'h2',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.HeadingXSmall,
      color: $theme.colors.contentPrimary,
      marginTop: 0,
      marginBottom: 0,
    })
  ),
};
