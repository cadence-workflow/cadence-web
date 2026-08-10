import { styled as createStyled, type Theme } from 'baseui';
import { type PanelOverrides } from 'baseui/accordion';
import { type FormControlOverrides } from 'baseui/form-control';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  panel: {
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
  schedulePeriodFormControl: {
    ControlContainer: {
      style: {
        marginBottom: 0,
      },
    },
  } satisfies FormControlOverrides,
};

export const styled = {
  ToggleRow: createStyled(
    'div',
    (): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
    })
  ),
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
  Divider: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      flex: 1,
      height: '1px',
      backgroundColor: $theme.colors.borderOpaque,
    })
  ),
};
