import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  tabContentContainer: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.sizing.scale900,
    marginBottom: theme.sizing.scale900,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
