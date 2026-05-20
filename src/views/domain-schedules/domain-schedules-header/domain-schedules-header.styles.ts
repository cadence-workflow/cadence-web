import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Container: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale600,
    })
  ),
  TitleRow: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: $theme.sizing.scale600,
    })
  ),
  Title: createStyled(
    'h2',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.HeadingXSmall,
      color: $theme.colors.contentPrimary,
      marginTop: 0,
      marginBottom: 0,
    })
  ),
};
