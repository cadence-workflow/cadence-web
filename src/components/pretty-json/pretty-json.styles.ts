import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  container: (theme) => ({
    ...theme.typography.MonoLabelXSmall,
  }),
  basicChildStyle: (theme) => ({
    marginLeft: theme.sizing.scale550,
    marginRight: theme.sizing.scale550,
    marginTop: theme.sizing.scale0,
    marginBottom: theme.sizing.scale0,
  }),
  stringValue: {
    color: '#A964F7',
    wordBreak: 'break-all',
  },
  booleanValue: {
    color: '#FC823A',
  },
  nullValue: {
    color: '#5B91F5',
  },
  undefinedValue: {
    color: '#5B91F5',
  },
  punctuation: (theme) => ({
    color: theme.colors.contentInverseTertiary,
  }),
  clickableLabel: (theme) => ({
    color: '#016974',
    marginRight: theme.sizing.scale200,
    cursor: 'pointer',
  }),
  label: {
    color: '#016974',
    marginRight: '7px',
  },
  numberValue: {
    color: '#06C167',
  },
  collapsedContent: (theme) => ({
    color: theme.colors.contentInverseTertiary,
    ':after': {
      content: '" ... "',
    },
  }),
  otherValue: {},
  expandIcon: {},
  collapseIcon: {},
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
