import { type Theme } from 'baseui';
import { type InputOverrides } from 'baseui/input';
import { type SelectOverrides } from 'baseui/select';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const overrides = {
  keySelect: {
    Root: {
      style: (): StyleObject => ({
        flex: '0 0 200px', // Fixed width, no grow/shrink
      }),
    },
  } satisfies SelectOverrides,
  valueInput: {
    Root: {
      style: (): StyleObject => ({
        flex: '1',
        minWidth: '0', // Allow shrinking
      }),
    },
  } satisfies InputOverrides,
};

const cssStylesObj = {
  container: (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderLeft: `2px solid ${theme.colors.borderOpaque}`,
    paddingLeft: '16px',
  }),
  attributeRow: () => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    width: '100%',
  }),
  keyContainer: () => ({
    flex: '0 0 200px', // Fixed width, no grow/shrink
  }),
  valueContainer: () => ({
    flex: '1',
    minWidth: '0', // Allow shrinking
  }),
  buttonContainer: () => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: '40px',
    paddingTop: '4px',
  }),
  deleteButton: () => ({
    padding: '8px',
    borderRadius: '8px',
  }),
  addButtonContainer: () => ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  }),
  addButton: () => ({
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '16px',
  }),
  plusIcon: () => ({
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
