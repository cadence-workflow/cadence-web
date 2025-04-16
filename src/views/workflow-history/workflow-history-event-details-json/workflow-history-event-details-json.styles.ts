import { type ButtonOverrides } from 'baseui/button';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  jsonViewWrapper: {
    position: 'relative',
    width: '100%',
  },
  jsonViewContainer: (theme) => ({
    padding: theme.sizing.scale600,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borders.radius300,
    maxHeight: '50vh',
    overflow: 'auto',
  }),
  jsonViewHeader: (theme) => ({
    display: 'flex',
    position: 'absolute',
    right: theme.sizing.scale400,
    top: theme.sizing.scale400,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;

export const overrides = {
  copyButton: {
    BaseButton: {
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
    },
  } satisfies ButtonOverrides,
};
