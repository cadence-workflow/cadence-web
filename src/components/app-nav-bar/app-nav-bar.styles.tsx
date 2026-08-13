import { type SnackbarElementOverrides } from 'baseui/snackbar';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  titleIcon: {
    display: 'flex',
    height: '1em',
  },
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;

export const overrides = {
  errorSnackbar: {
    Root: {
      style: {
        backgroundColor: '#c62828',
      },
    },
  } satisfies SnackbarElementOverrides,
};
