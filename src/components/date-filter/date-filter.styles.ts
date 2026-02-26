import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type DatepickerOverrides } from 'baseui/datepicker';
import type { FormControlOverrides } from 'baseui/form-control/types';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  dateFormControl: {
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
  timeFormControl: {
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelXSmall,
      }),
    },
    ControlContainer: {
      style: (): StyleObject => ({
        margin: '0px',
        display: 'flex',
        flexDirection: 'column',
      }),
    },
  } satisfies FormControlOverrides,
  popover: {
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
        background: $theme.colors.backgroundPrimary,
      }),
    },
  } satisfies PopoverOverrides,
  menuItemButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
        justifyContent: 'flex-start',
        whiteSpace: 'nowrap',
      }),
    },
  } satisfies ButtonOverrides,
  calendar: {
    Root: {
      style: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
  } satisfies DatepickerOverrides,
};

export const styled = {
  PopoverContentContainer: createStyled('div', {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  }),
  CloseButtonContainer: createStyled('div', ({ $theme }) => ({
    position: 'absolute',
    top: $theme.sizing.scale400,
    right: $theme.sizing.scale400,
  })),
  ContentHeader: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelMedium,
    paddingLeft: $theme.sizing.scale500,
  })),
  ContentColumn: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale600,
    paddingTop: $theme.sizing.scale700,
    paddingBottom: $theme.sizing.scale700,
    paddingLeft: $theme.sizing.scale600,
    paddingRight: $theme.sizing.scale600,
    ':not(:last-child)': {
      borderRight: `1px solid ${$theme.colors.borderOpaque}`,
    },
  })),
  MenuContainer: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  }),
  MenuItemsContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale100,
  })),
  TimeInputsContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: $theme.sizing.scale300,
  })),
  TimeInputContainer: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '50%',
  }),
};
