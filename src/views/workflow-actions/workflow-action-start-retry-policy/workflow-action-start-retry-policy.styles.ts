import { type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const overrides = {
  toggle: {
    Root: {
      style: {
        alignItems: 'center',
      },
    },
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
      }),
    },
  },
};

const cssStylesObj = {
  retryPolicySection: (theme) => ({
    borderLeft: `2px solid ${theme.colors.borderOpaque}`,
    paddingLeft: '16px',
    display: 'flex',
    flexDirection: 'column',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
