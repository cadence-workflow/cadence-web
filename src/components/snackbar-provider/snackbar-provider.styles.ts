import { type Theme } from 'baseui';
import { type SnackbarElementOverrides } from 'baseui/snackbar';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  snackbar: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.contentPositive,
      }),
    },
  } satisfies SnackbarElementOverrides,
};
