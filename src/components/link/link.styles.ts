import { type Theme, withStyle } from 'baseui';
import { StyledLink } from 'baseui/link';

import { type Props } from './link.types';

export const styled = {
  LinkBase: withStyle<typeof StyledLink, { disabled: boolean }>(
    StyledLink,
    ({ $theme, color }: { $theme: Theme; color?: Props['color'] }) => {
      let effectiveColors:
        | {
            linkText: string;
            linkVisited: string;
            linkHover: string;
            linkActive: string;
          }
        | undefined = undefined;

      if (color === 'contentPrimary' || !color) {
        effectiveColors = {
          linkText: $theme.colors.linkText,
          linkVisited: $theme.colors.linkText, // keep visited color same as original color
          linkHover: $theme.colors.linkHover,
          linkActive: $theme.colors.linkActive,
        };
      } else if (color === 'contentInversePrimary') {
        effectiveColors = {
          linkText: $theme.colors.contentInversePrimary,
          linkVisited: $theme.colors.contentInversePrimary, // keep visited color same as original color
          linkHover: $theme.colors.contentInverseSecondary,
          linkActive: $theme.colors.contentInverseSecondary,
        };
      }

      return {
        '[disabled]': {
          pointerEvents: 'none',
          color: `${$theme.colors.contentStateDisabled} !important`,
        },
        ':visited': {
          color: effectiveColors?.linkVisited || color,
        },
        ':hover': {
          color: effectiveColors?.linkHover || color,
        },
        ':active': {
          color: effectiveColors?.linkActive || color,
        },
        color: effectiveColors?.linkText || color,
      };
    }
  ),
};
