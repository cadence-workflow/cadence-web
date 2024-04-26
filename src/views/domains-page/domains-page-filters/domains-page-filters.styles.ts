import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';
import type { InputOverrides } from 'baseui/input/types';
import { StyleObject } from 'styletron-react';

export const overrides = {
  searchInput: {
    StartEnhancer: {
      style: (): StyleObject => ({
        padding: '0px',
      }),
    },
  } satisfies InputOverrides,
};

const cssStylesObj = {
  titleContainer: (theme) => ({
    marginTop: theme.sizing.scale1200,
    marginBottom: theme.sizing.scale700,
    display: 'flex',
    gap: theme.sizing.scale300,
    alignItems: 'center',
  }),
  searchBarContainer: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.sizing.scale500,
    whiteSpace: 'nowrap',
    marginBottom: theme.sizing.scale300,
    [theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
  }),

  filtersContainer: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexWrap: 'wrap',
    gap: theme.sizing.scale500,
    marginBottom: theme.sizing.scale700,
    [theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
  }),
  clearBtnContainer: (theme) => ({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    [theme.mediaQuery.medium]: {
      flex: '0 0 auto',
    },
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
