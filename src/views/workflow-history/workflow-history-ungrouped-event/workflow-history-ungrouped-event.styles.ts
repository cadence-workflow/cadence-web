import { styled as createStyled, type Theme } from 'baseui';
import { type PanelOverrides } from 'baseui/accordion';
import { type BadgeOverrides } from 'baseui/badge';
import { type StyleObject } from 'styletron-react';

import { WORKFLOW_HISTORY_UNGROUPED_GRID_TEMPLATE_COLUMNS } from '../workflow-history-ungrouped-table/workflow-history-ungrouped-table.constants';

export const styled = {
  CardHeaderContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelSmall,
    display: 'grid',
    gridTemplateColumns: WORKFLOW_HISTORY_UNGROUPED_GRID_TEMPLATE_COLUMNS,
    gap: $theme.sizing.scale600,
    width: '100%',
    alignItems: 'center',
  })),
  CardStatusContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale500,
    overflowWrap: 'anywhere',
  })),
  CardHeaderFieldContainer: createStyled('div', {
    overflowWrap: 'anywhere',
  }),
  CardLabelContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale400,
  })),
  ResetButtonContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      justifyContent: 'flex-end',
      paddingRight: $theme.sizing.scale400,
    })
  ),
};

export const overrides = (animateBackgroundOnEnter?: boolean) => ({
  panel: {
    PanelContainer: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.borders.border100,
        borderRadius: $theme.borders.radius300,
        borderWidth: '0px',
        marginTop: $theme.sizing.scale0,
        marginBottom: $theme.sizing.scale0,
        ':hover': {
          backgroundColor: $theme.colors.backgroundSecondary,
        },
        ...(animateBackgroundOnEnter && {
          animationDuration: '2s',
          animationName: {
            from: {
              backgroundColor: $theme.colors.backgroundTertiary,
            },
            to: {
              backgroundColor: $theme.colors.backgroundPrimary,
            },
          },
        }),
        overflow: 'hidden',
      }),
    },
    Header: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        // https://github.com/uber/baseweb/blob/main/src/accordion/styled-components.ts#L50
        // Since the original Panel uses longhand properties, we need to use longhand in overrides
        paddingTop: $theme.sizing.scale200,
        paddingBottom: $theme.sizing.scale200,
        paddingLeft: $theme.sizing.scale700,
        paddingRight: $theme.sizing.scale700,
        backgroundColor: 'inherit',
      }),
    },
    Content: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        // https://github.com/uber/baseweb/blob/main/src/accordion/styled-components.ts#L102
        // Since the original Panel uses longhand properties, we need to use longhand in overrides
        paddingTop: 0,
        paddingBottom: $theme.sizing.scale600,
        paddingLeft: $theme.sizing.scale700,
        paddingRight: $theme.sizing.scale700,
        backgroundColor: 'inherit',
      }),
    },
  } satisfies PanelOverrides,
  badge: {
    Badge: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundSecondary,
        color: $theme.colors.contentSecondary,
        ...$theme.typography.LabelXSmall,
        whiteSpace: 'nowrap',
        marginLeft: $theme.sizing.scale100,
      }),
    },
  } satisfies BadgeOverrides,
});
