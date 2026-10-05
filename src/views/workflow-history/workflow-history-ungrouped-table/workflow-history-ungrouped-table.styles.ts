import { styled as createStyled, type Theme } from 'baseui';

import { WORKFLOW_HISTORY_UNGROUPED_GRID_TEMPLATE_COLUMNS } from './workflow-history-ungrouped-table.constants';

export const styled = {
  TableHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'none',
    [$theme.mediaQuery.medium]: {
      // border thickness + accordion panel left padding
      paddingLeft: `calc(2px + ${$theme.sizing.scale300})`,
      // accordion panel right padding + border thickness
      paddingRight: `calc(${$theme.sizing.scale300} + 2px)`,
      paddingBottom: $theme.sizing.scale200,
      ...$theme.typography.LabelXSmall,
      color: $theme.colors.contentSecondary,
      display: 'grid',
      gridTemplateColumns: WORKFLOW_HISTORY_UNGROUPED_GRID_TEMPLATE_COLUMNS,
      gap: $theme.sizing.scale600,
      width: '100%',
    },
  })),
};
