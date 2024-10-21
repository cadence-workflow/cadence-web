import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  emptyDetails: (theme) => ({
    ...theme.typography.LabelXSmall,
    color: theme.colors.contentTertiary,
    textAlign: 'center',
    padding: `${theme.sizing.scale700} 0`,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
