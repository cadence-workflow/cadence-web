import { styled as createStyled, type Theme } from 'baseui';
import type { BannerOverrides } from 'baseui/banner';
import { type StyleObject } from 'styletron-react';

export const PAUSED_BANNER_ICON_SIZE = 20;

export const styled = {
  ValueText: createStyled(
    'span',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      fontWeight: $theme.typography.LabelSmall.fontWeight,
    })
  ),
};

export const overrides = {
  banner: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: $theme.sizing.scale500,
      }),
    },
    Message: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.ParagraphSmall,
      }),
    },
  } satisfies BannerOverrides,
};
