import { type Theme } from 'baseui';
import { type TextareaOverrides } from 'baseui/textarea';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  textarea: {
    Input: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.MonoParagraphXSmall,
      }),
    },
  } satisfies TextareaOverrides,
};
