import { styled as createStyled, type Theme } from 'baseui';
import { type PanelOverrides } from 'baseui/accordion';
import { type BadgeOverrides } from 'baseui/badge';
import { type StyleObject } from 'styletron-react';

import { WORKFLOW_HISTORY_UNGROUPED_GRID_TEMPLATE_COLUMNS } from '../workflow-history-ungrouped-table/workflow-history-ungrouped-table.constants';

export const styled = {
  CardContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    padding: `${$theme.sizing.scale200} 0`,
  })),
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
};

export const overrides = (animateBorderOnEnter?: boolean) => ({
  panel: {
    PanelContainer: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.borders.border100,
        borderRadius: $theme.borders.radius300,
        borderWidth: '2px',
        animationDuration: '2s',
        ...(animateBorderOnEnter && {
          animationName: {
            from: {
              boxShadow: `0px 0px 0px 2px ${$theme.colors.primary}`,
            },
            to: {
              boxShadow: `0px 0px 0px 0px rgba(0, 0, 0, 0)`,
            },
          },
        }),
        overflow: 'hidden',
        marginBottom: $theme.sizing.scale300,
        ':last-child': {
          marginBottom: 0,
        },
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
