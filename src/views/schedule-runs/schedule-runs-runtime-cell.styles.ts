import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Container: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      alignItems: 'center',
      display: 'flex',
      gap: $theme.sizing.scale200,
    })
  ),
};
