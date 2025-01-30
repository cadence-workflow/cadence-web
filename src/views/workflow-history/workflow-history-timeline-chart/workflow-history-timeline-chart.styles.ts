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
    borderWidth: '0 2px !important',
    color: `${theme.colors.contentPrimary} !important`,
    backgroundColor: `${theme.colors.backgroundSecondary} !important`,
    borderColor: `${theme.colors.contentPrimary} !important`,
  }),
  timerCompleted: (theme) => ({
    paddingInline: '2px',
    borderWidth: '0 2px !important',
    color: `${theme.colors.contentPrimary} !important`,
    backgroundColor: '#D3EFDA !important',
    borderColor: '#009A51 !important',
  }),
  timerNegative: (theme) => ({
    paddingInline: '2px',
    borderWidth: '0 2px !important',
    color: `${theme.colors.contentPrimary} !important`,
    backgroundColor: '#FFE1DE !important',
    borderColor: `${theme.colors.negative} !important`,
  }),
  completed: (theme) => ({
    paddingInline: '2px',
    color: `${theme.colors.contentPrimary} !important`,
    backgroundColor: '#D3EFDA !important',
    borderColor: '#009A51 !important',
  }),
  ongoing: (theme) => ({
    paddingInline: '2px',
    color: `${theme.colors.contentPrimary} !important`,
    backgroundColor: '#DEE9FE !important',
    borderColor: `${theme.colors.accent} !important`,
  }),
  negative: (theme) => ({
    paddingInline: '2px',
    color: `${theme.colors.contentPrimary} !important`,
    backgroundColor: '#FFE1DE !important',
    borderColor: `${theme.colors.negative} !important`,
  }),
  waiting: (theme) => ({
    paddingInline: '2px',
    color: `${theme.colors.contentPrimary} !important`,
    backgroundColor: `${theme.colors.backgroundSecondary} !important`,
    borderColor: `${theme.colors.contentPrimary} !important`,
  }),
  singleCompleted: (theme) => ({
    color: `${theme.colors.contentPrimary} !important`,
    borderColor: '#009A51 !important',
  }),
  singleNegative: (theme) => ({
    color: `${theme.colors.contentPrimary} !important`,
    borderColor: `${theme.colors.negative} !important`,
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
