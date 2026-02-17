import { type Theme } from 'baseui';
import { type FormControlOverrides } from 'baseui/form-control';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const overrides = {
  taskListWarningCaption: {
    Caption: {
      style: ({ $theme }: { $theme: Theme }) => ({
        color: $theme.colors.warning500,
      }),
    },
  } satisfies FormControlOverrides,
};

const cssStylesObj = {
  warningCaption: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
