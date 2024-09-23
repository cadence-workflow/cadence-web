import { type Theme, styled as createStyled } from 'baseui';

import { getMediaQueryMargins } from '@/utils/media-query/get-media-queries-margins';

export const styled = {
  PageSection: createStyled('section', ({ $theme }: { $theme: Theme }) => ({
    ...getMediaQueryMargins($theme, (margin) => ({
      maxWidth: `${$theme.grid.maxWidth + 2 * margin}px`,
      paddingRight: `${margin}px`,
      paddingLeft: `${margin}px`,
    })),
  })),
};
