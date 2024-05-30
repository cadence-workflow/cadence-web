import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  jsonViewContainer: (theme) => ({
    padding: theme.sizing.scale600,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borders.radius300,
  }),
  jsonViewHeader: (theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.sizing.scale600,
    marginBottom: theme.sizing.scale700,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
