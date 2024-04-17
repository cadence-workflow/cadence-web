import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  spinnerContainer: (theme) => ({
    padding: `${theme.sizing.scale1200} 0px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
