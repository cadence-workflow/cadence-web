import { type Theme, styled as createStyled } from 'baseui';

import { getMediaQueryMargins } from '@/utils/media-query/get-media-queries-margins';

export const styled = {
  PageSection: createStyled('section', ({ $theme }: { $theme: Theme }) => ({
    width: '100%',
    margin: '0 auto',
    paddingLeft: $theme.sizing.scale600,
    paddingRight: $theme.sizing.scale600,
    // override default styles by media query specific styles
    ...getMediaQueryMargins($theme, (margin) => ({
      maxWidth: `${$theme.grid.maxWidth + 2 * margin}px`,
      paddingRight: `${margin}px`,
      paddingLeft: `${margin}px`,
    })),
  })),
};
