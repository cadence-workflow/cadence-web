import { styled as createStyled, type Theme } from 'baseui';
import { type FormControlOverrides } from 'baseui/form-control';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  schedulePeriodFormControl: {
    ControlContainer: {
      style: {
        marginBottom: 0,
      },
    },
  } satisfies FormControlOverrides,
};

export const styled = {
  SchedulePeriodRow: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: $theme.sizing.scale400,
    })
  ),
  SchedulePeriodField: createStyled(
    'div',
    (): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
    })
  ),
  SchedulePeriodInputLabel: createStyled(
    'label',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      color: $theme.colors.contentPrimary,
      marginBottom: $theme.sizing.scale200,
    })
  ),
};
