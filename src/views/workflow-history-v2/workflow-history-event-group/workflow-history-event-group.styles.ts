import { styled as createStyled, type Theme } from 'baseui';
import { type PanelOverrides } from 'baseui/accordion';
import { type BadgeOverrides } from 'baseui/badge';
import { type StyleObject } from 'styletron-react';

import { type WorkflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';

import workflowHistoryEventFilteringTypeColorsConfig from '../config/workflow-history-event-filtering-type-colors.config';

export const styled = {
  HeaderContent: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    gap: $theme.sizing.scale600,
  })),
  HeaderLabel: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelMedium,
    flex: 1,
    minWidth: 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  })),
  HeaderStatus: createStyled('div', () => ({
    flexShrink: 0,
  })),
  HeaderSecondaryDetails: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale200,
      flexWrap: 'wrap',
      flexShrink: 0,
    })
  ),
  HeaderTime: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentTertiary,
    whiteSpace: 'nowrap',
  })),
  HeaderDuration: createStyled('div', () => ({
    flexShrink: 0,
  })),
  HeaderDetails: createStyled('div', () => ({
    flexShrink: 0,
  })),
};

export const overrides = (
  eventFilteringType: WorkflowHistoryEventFilteringType
) => ({
  panel: {
    PanelContainer: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.borders.border100,
        borderRadius: 0,
        borderWidth: '0px',
        marginTop: $theme.sizing.scale0,
        marginBottom: $theme.sizing.scale0,
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
        display: 'flex',
        alignItems: 'center',
        ':hover': {
          backgroundColor:
            workflowHistoryEventFilteringTypeColorsConfig[eventFilteringType]
              .backgroundHighlighted,
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
