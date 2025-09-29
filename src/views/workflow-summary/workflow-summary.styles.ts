import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  pageContainer: (theme) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.sizing.scale1000,
  }),
  mainContent: (theme) => ({
    flex: '1 0 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.sizing.scale800,
  }),
  jsonPanel: (theme) => ({
    flex: '1 0 300px',
    [theme.mediaQuery.large]: {
      display: 'none',
    },
  }),
  jsonPanelWide: (theme) => ({
    display: 'none',
    [theme.mediaQuery.large]: {
      display: 'block',
      flex: '1 0 300px',
    },
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
