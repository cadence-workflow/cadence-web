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
    [theme.mediaQuery.large]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  }),
  mainContent: (theme) => ({
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.sizing.scale800,
  }),
  jsonPanel: (theme) => ({
    minWidth: 0,
    [theme.mediaQuery.large]: {
      display: 'none',
    },
  }),
  jsonPanelWide: (theme) => ({
    minWidth: 0,
    display: 'none',
    [theme.mediaQuery.large]: {
      display: 'block',
    },
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
