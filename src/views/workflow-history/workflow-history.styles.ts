import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  eventsContainer: (theme) => ({
    display: 'flex',
    marginTop: theme.sizing.scale500,
  }),
  compactSection: {
    display: 'flex',
    flexDirection: 'column',
    width: '370px',
  },
  timelineSection: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
