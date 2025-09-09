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
    gap: '16px',
    borderLeft: `2px solid ${theme.colors.borderOpaque}`,
    paddingLeft: '16px',
  }),
  inputRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  inputContainer: {
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: '40px',
    paddingTop: '4px',
  },
  deleteButton: {
    padding: '8px',
    borderRadius: '8px',
  },
  addButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  addButton: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '16px',
  },
  plusIcon: {
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1',
  },
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
