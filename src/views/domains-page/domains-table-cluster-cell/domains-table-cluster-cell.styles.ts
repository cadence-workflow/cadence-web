import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  clustersLinks: (theme) => ({
    display: 'flex',
    gap: theme.sizing.scale400,
    ...theme.typography.LabelXSmall,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
