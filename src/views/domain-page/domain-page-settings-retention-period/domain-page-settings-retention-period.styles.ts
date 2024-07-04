import { type Theme } from 'baseui';
import type { InputOverrides } from 'baseui/input';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  input: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.ParagraphSmall,
        maxWidth: '160px',
      }),
    },
  } satisfies InputOverrides,
};
