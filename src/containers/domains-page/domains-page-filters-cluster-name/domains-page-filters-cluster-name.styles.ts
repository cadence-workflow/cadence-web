import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';
import { Theme } from 'baseui';
import type { FormControlOverrides } from 'baseui/form-control/types';
import { StyleObject } from 'styletron-react';

export const overrides = {
  selectFormControl: {
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelXSmall,
      }),
    },
    ControlContainer: {
      style: (): StyleObject => ({
        margin: '0px',
      }),
    },
  } satisfies FormControlOverrides,
};

const cssStylesObj = {
  selectFilterContainer: (theme) => ({
    [theme.mediaQuery.medium]: {
      flex: '1',
    },
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
