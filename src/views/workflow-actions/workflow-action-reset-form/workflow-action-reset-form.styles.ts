import { type Theme } from 'baseui';
import { type CheckboxOverrides } from 'baseui/checkbox';
import { type RadioOverrides } from 'baseui/radio';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  radio: {
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
      }),
    },
  } satisfies RadioOverrides,
  checkbox: {
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
        alignSelf: 'center',
      }),
    },
  } satisfies CheckboxOverrides,
};
