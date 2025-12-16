import { type Theme } from 'baseui';
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
        '::placeholder': {
          ...$theme.typography.ParagraphSmall,
        },
      }),
    },
  } satisfies TextareaOverrides,
};

const cssStylesObj = {
  container: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.sizing.scale600,
    borderLeft: `2px solid ${theme.colors.borderOpaque}`,
    paddingLeft: theme.sizing.scale600,
  }),
  inputRow: (theme) => ({
    display: 'flex',
    gap: theme.sizing.scale300,
    alignItems: 'flex-start',
  }),
  inputContainer: {
    flex: 1,
  },
  buttonContainer: (theme) => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: '40px',
    paddingTop: theme.sizing.scale100,
  }),
  addButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
