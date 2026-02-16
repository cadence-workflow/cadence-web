import { type Theme } from 'baseui';
import { type BannerOverrides } from 'baseui/banner';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  banner: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        marginTop: $theme.sizing.scale100,
      }),
    },
    Message: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
      }),
    },
  } satisfies BannerOverrides,
};
