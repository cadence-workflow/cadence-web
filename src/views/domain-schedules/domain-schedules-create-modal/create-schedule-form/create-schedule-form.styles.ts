import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  SectionLabel: createStyled(
    'p',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelMedium,
      color: $theme.colors.contentPrimary,
      marginTop: $theme.sizing.scale800,
      marginBottom: $theme.sizing.scale300,
      borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
      paddingBottom: $theme.sizing.scale300,
    })
  ),
};
