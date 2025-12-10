import { styled as createStyled, type Theme } from 'baseui';
import { type PanelOverrides } from 'baseui/accordion';
import { type BadgeOverrides } from 'baseui/badge';
import { type StyleObject } from 'styletron-react';

import { type WorkflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';

import workflowHistoryEventFilteringTypeColorsConfig from '../config/workflow-history-event-filtering-type-colors.config';
import { WORKFLOW_HISTORY_UNGROUPED_GRID_TEMPLATE_COLUMNS } from '../workflow-history-ungrouped-table/workflow-history-ungrouped-table.constants';

export const styled = {
  HeaderContent: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphSmall,
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale200,
    paddingBottom: $theme.sizing.scale300,
    [$theme.mediaQuery.medium]: {
      display: 'grid',
      gridTemplateColumns: WORKFLOW_HISTORY_UNGROUPED_GRID_TEMPLATE_COLUMNS,
      width: '100%',
      alignItems: 'center',
      gap: $theme.sizing.scale600,
      paddingBottom: 0,
    },
  })),
  HeaderLabel: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelSmall,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  })),
  StatusContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale300,
    alignItems: 'center',
  })),
  SummarizedDetailsContainer: createStyled('div', {
    overflow: 'hidden',
  }),
  ActionsContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale300,
    alignItems: 'center',
    [$theme.mediaQuery.medium]: {
      margin: `-${$theme.sizing.scale200} 0`,
    },
  })),
  GroupDetailsGridContainer: createStyled('div', {
    display: 'grid',
    gridTemplateColumns: WORKFLOW_HISTORY_UNGROUPED_GRID_TEMPLATE_COLUMNS,
  }),
  GroupDetailsNameSpacer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'none',
      [$theme.mediaQuery.medium]: {
        gridColumn: '1 / span 3',
      },
    })
  ),
  GroupDetailsContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      gridColumn: '1 / -1',
      [$theme.mediaQuery.medium]: {
        gridColumn: '4 / -1',
      },
      border: `2px solid ${$theme.colors.borderOpaque}`,
      borderRadius: $theme.borders.radius400,
      padding: $theme.sizing.scale500,
      backgroundColor: $theme.colors.backgroundPrimary,
    })
  ),
};

export const overrides = (
  eventFilteringType: WorkflowHistoryEventFilteringType,
  animateOnEnter?: boolean
) => ({
  panel: {
    PanelContainer: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        borderColor: $theme.borders.border100.borderColor,
        borderStyle: $theme.borders.border100.borderStyle,
        borderRadius: 0,
        borderTopWidth: $theme.borders.border100.borderWidth,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        marginTop: 0,
        marginBottom: 0,
        overflow: 'hidden',
      }),
    },
    Header: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        // https://github.com/uber/baseweb/blob/main/src/accordion/styled-components.ts#L50
        // Since the original Panel uses longhand properties, we need to use longhand in overrides
        paddingTop: $theme.sizing.scale300,
        paddingBottom: $theme.sizing.scale300,
        paddingLeft: $theme.sizing.scale300,
        paddingRight: $theme.sizing.scale300,
        backgroundColor: 'inherit',
        display: 'flex',
        alignItems: 'center',
        ':hover': {
          backgroundColor:
            workflowHistoryEventFilteringTypeColorsConfig[eventFilteringType]
              .backgroundHighlighted,
        },
        ...(animateOnEnter && {
          animationDuration: '2s',
          animationName: {
            from: {
              backgroundColor:
                workflowHistoryEventFilteringTypeColorsConfig[
                  eventFilteringType
                ].backgroundHighlighted,
            },
            to: {
              backgroundColor: 'inherit',
            },
          },
        }),
      }),
    },
    Content: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        // https://github.com/uber/baseweb/blob/main/src/accordion/styled-components.ts#L102
        // Since the original Panel uses longhand properties, we need to use longhand in overrides
        paddingTop: 0,
        paddingBottom: $theme.sizing.scale600,
        paddingLeft: 0,
        paddingRight: 0,
        [$theme.mediaQuery.medium]: {
          paddingLeft: $theme.sizing.scale700,
          paddingRight: $theme.sizing.scale700,
        },
        backgroundColor: 'inherit',
      }),
    },
    ToggleIcon: {
      style: {
        display: 'none',
      },
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
