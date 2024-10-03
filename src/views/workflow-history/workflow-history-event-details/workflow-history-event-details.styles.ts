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
  detailsRow: (theme) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: theme.sizing.scale300,
    flexWrap: 'wrap',
    paddingTop: theme.sizing.scale200,
    paddingBottom: theme.sizing.scale200,
    wordBreak: 'break-word',
  }),
  detailsLabel: (theme) => ({
    minWidth: '150px',
    maxWidth: '150px',
    display: 'flex',
    color: theme.colors.contentTertiary,
    ...theme.typography.LabelXSmall,
  }),
  detailsValue: (theme) => ({
    color: theme.colors.contentPrimary,
    ...theme.typography.LabelXSmall,
    display: 'flex',
    flex: '1 0 300px',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
