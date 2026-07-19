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
    whiteSpace: 'nowrap',
  }),
  dateContainer: () => ({
    flexShrink: 0,
    whiteSpace: 'nowrap',
  }),
  arrowIcon: () => ({
    flexShrink: 0,
  }),
  missingDateContainer: (theme: Theme) => ({
    color: theme.colors.contentSecondary,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
