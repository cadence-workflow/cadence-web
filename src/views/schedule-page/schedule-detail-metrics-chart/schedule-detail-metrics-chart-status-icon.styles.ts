import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Icon: createStyled<'span', { $size: number; $scale?: number }>(
    'span',
    ({ $size, $scale }: { $size: number; $scale?: number }) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: `${$size}px`,
      height: `${$size}px`,
      flexShrink: 0,
      overflow: 'visible',
      // Scaling the wrapper leaves the layout box at `$size` while the glyph
      // renders larger, which a bigger icon `size` would not do.
      transformOrigin: 'center',
      ...($scale == null ? {} : { transform: `scale(${$scale})` }),
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

/** `Spinner` is a bare Styletron component, so its only hook is `$style`. */
export const staticSpinnerStyle: StyleObject = { animation: 'none' };
