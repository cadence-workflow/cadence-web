import { type SkeletonOverrides } from 'baseui/skeleton/types';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  timer: (theme) => ({
    paddingInline: '2px',
    color: theme.colors.contentPrimary,
    backgroundColor: theme.colors.backgroundSecondary,
    borderTop: '0',
    borderBottom: '0',
    borderLeft: '2px',
    borderRight: '2px',
    borderColor: theme.colors.contentPrimary,
  }),
  timerCompleted: (theme) => ({
    paddingInline: '2px',
    color: theme.colors.contentPrimary,
    backgroundColor: '#D3EFDA',
    borderTop: '0',
    borderBottom: '0',
    borderLeft: '2px',
    borderRight: '2px',
    borderColor: '#009A51',
  }),
  timerNegative: (theme) => ({
    paddingInline: '2px',
    color: theme.colors.contentPrimary,
    backgroundColor: '#FFE1DE',
    borderTop: '0',
    borderBottom: '0',
    borderLeft: '2px',
    borderRight: '2px',
    borderColor: theme.colors.negative,
  }),
  completed: (theme) => ({
    paddingInline: '2px',
    color: theme.colors.contentPrimary,
    backgroundColor: '#D3EFDA',
    borderColor: '#009A51',
  }),
  ongoing: (theme) => ({
    paddingInline: '2px',
    color: theme.colors.contentPrimary,
    backgroundColor: '#DEE9FE',
    borderColor: theme.colors.accent,
  }),
  negative: (theme) => ({
    paddingInline: '2px',
    color: theme.colors.contentPrimary,
    backgroundColor: '#FFE1DE',
    borderColor: theme.colors.negative,
  }),
  waiting: (theme) => ({
    paddingInline: '2px',
    color: theme.colors.contentPrimary,
    backgroundColor: theme.colors.backgroundSecondary,
    borderColor: theme.colors.contentPrimary,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;

export const overrides = {
  skeleton: {
    Root: {
      style: {
        width: '100%',
      },
    },
  } satisfies SkeletonOverrides,
};
