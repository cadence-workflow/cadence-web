import { type Theme } from 'baseui';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  runtimeContainer: (theme: Theme) => ({
    display: 'flex',
    gap: theme.sizing.scale400,
    alignItems: 'center',
  }),
  missingDateContainer: (theme: Theme) => ({
    color: theme.colors.contentSecondary,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
