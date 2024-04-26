import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  titleContainer: (theme) => ({
    marginTop: theme.sizing.scale1200,
    marginBottom: theme.sizing.scale700,
    display: 'flex',
    gap: theme.sizing.scale300,
    alignItems: 'center',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
