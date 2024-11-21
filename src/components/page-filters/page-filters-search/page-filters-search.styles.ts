import { type Theme } from 'baseui';
import { type InputOverrides } from 'baseui/input';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  searchInput: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale950,
      }),
    },
    Input: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.ParagraphSmall,
      }),
    },
  } satisfies InputOverrides,
};
