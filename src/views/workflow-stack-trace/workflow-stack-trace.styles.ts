import { type Theme } from 'baseui';
import { type SkeletonOverrides } from 'baseui/skeleton/types';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const overrides = {
  loadingSkeleton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        borderRadius: $theme.borders.radius300,
        marginTop: $theme.sizing.scale600,
        height: '100%',
      }),
    },
  } satisfies SkeletonOverrides,
};

const cssStylesObj = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  pageHeader: (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.sizing.scale500,
  }),
  stackTrace: (theme) => ({
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.sizing.scale800,
    borderRadius: theme.borders.radius300,
    marginTop: theme.sizing.scale600,
    color: theme.colors.contentSecondary,
    flex: 1,
  }),
  stackTracePre: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
