import { type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type PopoverOverrides } from 'baseui/popover';
import { type SnackbarElementOverrides } from 'baseui/snackbar';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  popover: {
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundPrimary,
      }),
    },
  } satisfies PopoverOverrides,
  snackbar: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.contentPositive,
      }),
    },
  } satisfies SnackbarElementOverrides,
  button: {
    LoadingSpinner: {
      style: ({ $theme }) => ({
        borderRightColor: $theme.colors.accent200,
        borderLeftColor: $theme.colors.accent200,
        borderBottomColor: $theme.colors.accent200,
      }),
    },
  } satisfies ButtonOverrides,
};
