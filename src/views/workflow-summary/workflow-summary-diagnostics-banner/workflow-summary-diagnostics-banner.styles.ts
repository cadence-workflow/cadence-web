import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Banner: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      backgroundColor: $theme.colors.backgroundWarningLight,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${$theme.sizing.scale400} ${$theme.sizing.scale500}`,
      borderRadius: $theme.borders.radius400,
    })
  ),
  BannerTextContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      display: 'flex',
      gap: $theme.sizing.scale600,
      alignItems: 'center',
    })
  ),
};
