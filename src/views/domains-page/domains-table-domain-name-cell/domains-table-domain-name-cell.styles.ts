import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  domainNameCell: (theme) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.sizing.scale400,
    ...theme.typography.ParagraphSmall,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
