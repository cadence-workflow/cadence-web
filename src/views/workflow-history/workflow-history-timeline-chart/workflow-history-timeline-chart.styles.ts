import { styled as createStyled, withStyle, type Theme } from 'baseui';
import { Spinner } from 'baseui/spinner';
import { type TagOverrides } from 'baseui/tag';
import { type StyleObject } from 'styletron-react';

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

export const styled = {
  TimelineContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    marginTop: $theme.sizing.scale500,
    marginBottom: $theme.sizing.scale500,
    position: 'relative',
    zIndex: 0,
  })),
  LoaderContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    position: 'absolute',
    top: $theme.sizing.scale400,
    right: $theme.sizing.scale400,
    zIndex: 2,
  })),
  Spinner: withStyle(Spinner, ({ $theme }) => ({
    width: $theme.sizing.scale500,
    height: $theme.sizing.scale500,
    borderWidth: '2px',
    marginRight: '1px',
    borderTopColor: $theme.colors.contentInversePrimary,
    borderRightColor: $theme.colors.accent200,
    borderLeftColor: $theme.colors.accent200,
    borderBottomColor: $theme.colors.accent200,
  })),
};

export const overrides = {
  tag: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        borderRadius: $theme.borders.radius200,
      }),
    },
  } satisfies TagOverrides,
};
