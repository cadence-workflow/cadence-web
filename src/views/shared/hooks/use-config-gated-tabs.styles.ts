import { type Theme } from 'baseui';
import { type SnackbarElementOverrides } from 'baseui/snackbar';

export const overrides = {
  errorSnackbar: {
    Root: {
      style: ({ $theme }: { $theme: Theme }) => ({
        backgroundColor: $theme.colors.backgroundNegative,
      }),
    },
  } satisfies SnackbarElementOverrides,
};
