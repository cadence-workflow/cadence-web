import { styled as createStyled, type Theme, withStyle } from 'baseui';
import type { BannerOverrides } from 'baseui/banner';
import { StyledLink } from 'baseui/link';
import { type StyleObject } from 'styletron-react';

export const PAUSED_BANNER_ICON_SIZE = 20;

export const styled = {
  ReasonValue: createStyled('span', (): StyleObject => ({
    fontWeight: 'normal',
  })),
  EmailLink: withStyle(StyledLink, ({ $theme }: { $theme: Theme }) => ({
    fontWeight: 'inherit',
    color: $theme.colors.contentPrimary,
    ':visited': {
      color: $theme.colors.contentPrimary,
    },
    ':hover': {
      color: $theme.colors.contentPrimary,
    },
    ':active': {
      color: $theme.colors.contentPrimary,
    },
  })),
};

export const overrides = {
  banner: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        marginLeft: 0,
        marginRight: 0,
        marginTop: $theme.sizing.scale600,
        marginBottom: 0,
      }),
    },
    Message: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
      }),
    },
  } satisfies BannerOverrides,
};
