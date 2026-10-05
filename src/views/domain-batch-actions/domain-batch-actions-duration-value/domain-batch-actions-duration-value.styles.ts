import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Duration: createStyled(
    'span',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
    })
  ),
};
