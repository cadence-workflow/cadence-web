import { styled as createStyled, type Theme } from 'baseui';

import { WORKFLOW_HISTORY_GROUPED_GRID_TEMPLATE_COLUMNS } from './workflow-history-grouped-table.constants';

export const styled = {
  TableHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    // border thickness + accordion panel left padding
    paddingLeft: `calc(2px + ${$theme.sizing.scale700})`,
    // accordion panel expand icon size + accordion panel right padding + border thickness
    paddingRight: `calc(${$theme.sizing.scale800} + ${$theme.sizing.scale700} + 2px)`,
    paddingBottom: $theme.sizing.scale200,
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentSecondary,
    display: 'grid',
    gridTemplateColumns: WORKFLOW_HISTORY_GROUPED_GRID_TEMPLATE_COLUMNS,
    gap: $theme.sizing.scale600,
    width: '100%',
  })),
};
