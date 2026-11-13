import { styled as createStyled } from 'baseui';

import { type StyleColorName } from './style.types';

export const styled = {
  Span: createStyled<'span', { $color?: StyleColorName; $bg?: StyleColorName }>(
    'span',
    ({ $theme, $color, $bg }) => ({
      ...($color ? { color: $theme.colors[$color] } : {}),
      ...($bg ? { backgroundColor: $theme.colors[$bg] } : {}),
    })
  ),
};
