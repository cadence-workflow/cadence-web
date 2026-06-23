import { styled as createStyled, type Theme } from 'baseui';
import { type PanelOverrides } from 'baseui/accordion';
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
  Divider: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      flex: 1,
      height: '1px',
      backgroundColor: $theme.colors.borderOpaque,
    })
  ),
};
