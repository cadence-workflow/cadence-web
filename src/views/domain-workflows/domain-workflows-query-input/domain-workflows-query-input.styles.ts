import { type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type InputOverrides } from 'baseui/input';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  input: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale950,
      }),
    },
    Input: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.MonoParagraphXSmall,
      }),
    },
  } satisfies InputOverrides,
  runButton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        whiteSpace: 'nowrap',
        height: $theme.sizing.scale950,
        ...$theme.typography.LabelSmall,
      }),
    },
  } satisfies ButtonOverrides,
};
