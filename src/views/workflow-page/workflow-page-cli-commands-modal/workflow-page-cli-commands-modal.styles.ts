import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const overrides = {};

const cssStylesObj = {
  rowContainer: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.sizing.scale300,
    paddingTop: theme.sizing.scale400,
    paddingBottom: theme.sizing.scale400,
    wordBreak: 'break-word',
    [theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
  }),
  rowLabel: (theme) => ({
    flex: '0',
    display: 'flex',
    color: theme.colors.contentPrimary,
    ...theme.typography.LabelXSmall,
    [theme.mediaQuery.medium]: {
      flex: '0 0 200px',
    },
  }),
  rowDetails: (theme) => ({
    ...theme.typography.ParagraphXSmall,
    display: 'flex',
    flexDirection: 'column',
    flex: '0',
    [theme.mediaQuery.medium]: {
      flex: '1',
    },
  }),
  commandContainer: (theme) => ({
    ...theme.typography.MonoParagraphXSmall,
    position: 'relative',
    padding: theme.sizing.scale600,
    paddingRight: theme.sizing.scale1200,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borders.radius300,
  }),
  copyButtonContainer: (theme) => ({
    display: 'flex',
    position: 'absolute',
    right: theme.sizing.scale400,
    top: theme.sizing.scale400,
  }),
  commandDescription: (theme) => ({
    color: theme.colors.contentTertiary,
    marginTop: theme.sizing.scale300,
    ...theme.typography.ParagraphXSmall,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
