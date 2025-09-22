import { type Theme } from 'baseui';
import { type PanelOverrides } from 'baseui/accordion';
import { type TextareaOverrides } from 'baseui/textarea';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const overrides = {
  jsonInput: {
    Input: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.MonoParagraphSmall,
      }),
    },
  } satisfies TextareaOverrides,
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
  optionalConfigPanel: {
    PanelContainer: {
      style: {
        borderWidth: '0',
      },
    },
    Content: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        paddingTop: $theme.sizing.scale600,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
      }),
    },
  } satisfies PanelOverrides,
};

const cssStylesObj = {
  expandOptionalSectionHeader: () => ({
    display: 'flex',
    alignItems: 'center',
  }),
  expandOptionalSectionDivider: (theme) => ({
    flex: 1,
    height: '1px',
    backgroundColor: theme.colors.borderOpaque,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
