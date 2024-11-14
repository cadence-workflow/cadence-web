import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  pageHeader: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.sizing.scale500,
    [theme.mediaQuery.medium]: {
      alignItems: 'center',
      flexDirection: 'row',
    },
  }),
  headerActions: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: theme.sizing.scale500,
    [theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
  }),
  eventsContainer: (theme) => ({
    display: 'flex',
    marginTop: theme.sizing.scale500,
    // gap: theme.sizing.scale400,
  }),
  compactSection: (theme) => ({
    display: 'none',
    [theme.mediaQuery.large]: {
      display: 'flex',
      flexDirection: 'column',
      width: '362px',
      maxHeight: `calc(100vh - ${theme.sizing.scale900})`, // fill page height excluding page bottom margin
      overflow: 'auto',
      position: 'sticky',
      top: 0,
      paddingRight: theme.sizing.scale800,
    },
  }),
  compactCardContainer: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.sizing.scale200} 0`,
    marginRight: theme.sizing.scale700,
  }),
  timelineSection: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  noResultsContainer: (theme) => ({
    textAlign: 'center',
    padding: `${theme.sizing.scale900} 0`,
    ...theme.typography.LabelSmall,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
