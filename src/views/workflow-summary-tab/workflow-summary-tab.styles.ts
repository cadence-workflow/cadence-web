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
    flex: '1 0 260px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.sizing.scale900,
  }),
  jsonArea: {
    flex: '1 0 260px',
  },
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
