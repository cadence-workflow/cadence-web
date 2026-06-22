import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  section: () => ({
    display: 'flex',
    flexDirection: 'column',
  }),
  tableContainer: (theme) => ({
    overflowX: 'auto',
    paddingBottom: theme.sizing.scale400,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
