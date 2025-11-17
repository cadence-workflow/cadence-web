import { type Theme } from 'baseui';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  failoverContainer: (theme: Theme) => ({
    display: 'flex',
    gap: theme.sizing.scale400,
    alignItems: 'center',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
