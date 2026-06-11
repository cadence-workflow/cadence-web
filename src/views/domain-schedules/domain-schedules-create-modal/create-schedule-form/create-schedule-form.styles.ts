import { type Theme } from 'baseui';
import { type CheckboxOverrides } from 'baseui/checkbox';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  pauseOnFailureCheckbox: {
    Root: {
      style: (): StyleObject => ({
        // Default is `flex-start` for horizontal label placement; center with the tick.
        alignItems: 'center',
      }),
    },
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.font250,
        color: $theme.colors.contentPrimary,
      }),
    },
  } satisfies CheckboxOverrides,
};
