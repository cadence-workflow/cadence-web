import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Icon: createStyled<'span', { $size: number }>(
    'span',
    ({ $size }: { $size: number }) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: `${$size}px`,
      height: `${$size}px`,
      flexShrink: 0,
    })
  ),
  Skipped: createStyled<'span', { $size: number }>(
    'span',
    ({ $theme, $size }: { $theme: Theme; $size: number }) => ({
      display: 'inline-block',
      width: `${$size}px`,
      height: `${$size}px`,
      boxSizing: 'border-box',
      border: `1px dashed ${$theme.colors.contentSecondary}`,
      borderRadius: '50%',
    })
  ),
};

/** Static spinner for the legend — timeline glyphs animate. */
export const staticSpinnerStyle: StyleObject = { animation: 'none' };
