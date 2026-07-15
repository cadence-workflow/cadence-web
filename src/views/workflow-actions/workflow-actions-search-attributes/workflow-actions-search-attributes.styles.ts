import { styled as createStyled, type Theme } from 'baseui';
import { type FormControlOverrides } from 'baseui/form-control';
import { type InputOverrides } from 'baseui/input';
import { type SelectOverrides } from 'baseui/select';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const styled = {
  Container: createStyled<'div', { $showSectionBorder?: boolean }>(
    'div',
    ({ $theme, $showSectionBorder }) => ({
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale600,
      ...($showSectionBorder && {
        borderLeft: `2px solid ${$theme.colors.borderOpaque}`,
        paddingLeft: $theme.sizing.scale600,
      }),
    })
  ),
};

export const overrides = {
  fieldFormControl: {
    ControlContainer: {
      style: {
        marginBottom: 0,
      },
    },
  } satisfies FormControlOverrides,
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
  attributeRow: (theme: Theme) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.sizing.scale300,
    width: '100%',
  }),
  keyContainer: () => ({
    flex: '0 0 200px', // Fixed width, no grow/shrink
  }),
  valueContainer: () => ({
    flex: '1',
    minWidth: '0', // Allow shrinking
  }),
  buttonContainer: (theme: Theme) => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: '40px',
    paddingTop: theme.sizing.scale100,
  }),
  addButtonContainer: () => ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
