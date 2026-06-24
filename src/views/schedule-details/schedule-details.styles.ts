import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  pageContainer: (theme) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.sizing.scale1000,
    [theme.mediaQuery.medium]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  }),
  mainContent: (theme) => ({
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.sizing.scale900,
  }),
  jsonPanel: () => ({
    minWidth: 0,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
