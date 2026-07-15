import { type Theme } from 'baseui';
import { type CheckboxOverrides } from 'baseui/checkbox';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const overrides = {
  toggle: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
      }),
    },
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
      }),
    },
  } satisfies CheckboxOverrides,
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
