import { styled as createStyled, type Theme } from 'baseui';

import WORKFLOW_HISTORY_UNGROUPED_GRID_TEMPLATE_COLUMNS_CONFIG from '../config/workflow-history-ungrouped-grid-template-columns.config';

export const styled = {
  TableHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    paddingLeft: '22px',
    paddingRight: '46px',
    paddingBottom: '2px',
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentSecondary,
    display: 'grid',
    gridTemplateColumns:
      WORKFLOW_HISTORY_UNGROUPED_GRID_TEMPLATE_COLUMNS_CONFIG,
    gap: $theme.sizing.scale600,
    width: '100%',
  })),
};
