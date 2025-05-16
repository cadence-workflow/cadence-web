import { type Theme } from 'baseui';
import { type TextareaOverrides } from 'baseui/textarea';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  jsonInput: {
    Input: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.MonoParagraphSmall,
        '::placeholder': {
          ...$theme.typography.ParagraphSmall,
        },
      }),
    },
  } satisfies TextareaOverrides,
};
