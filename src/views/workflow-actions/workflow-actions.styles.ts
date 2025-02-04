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
    BaseButton: {
      style: ({
        $theme,
        $isLoading,
      }: {
        $theme: Theme;
        $isLoading: boolean;
      }): StyleObject => ({
        ...($isLoading && {
          // https://github.com/uber/baseweb/blob/main/src/skeleton/skeleton.tsx
          // Background animation
          animationTimingFunction: 'ease-out',
          animationDuration: '1.5s',
          animationIterationCount: 'infinite',
          backgroundSize: '400% 100%',
          animationName: {
            '0%': {
              backgroundPosition: '100% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          },
          // Background gradient
          backgroundImage: `linear-gradient(135deg,
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundSecondary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary})`,
        }),
      }),
    },
    LoadingSpinnerContainer: {
      style: {
        display: 'none',
      } satisfies StyleObject,
    },
  } satisfies ButtonOverrides,
};
