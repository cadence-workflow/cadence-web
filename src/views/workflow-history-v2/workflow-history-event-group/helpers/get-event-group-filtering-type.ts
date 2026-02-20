import workflowHistoryFiltersTypeConfig from '@/views/workflow-history/config/workflow-history-filters-type.config';
import { type WorkflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';

import { type HistoryEventsGroup } from '../../workflow-history-v2.types';

// TODO @adhitya.mamallan - revisit this when we write the new grouping logic
function getEventGroupFilteringType(
  group: HistoryEventsGroup
): WorkflowHistoryEventFilteringType {
  for (const [eventGroupFilterType, filterConfig] of Object.entries(
    workflowHistoryFiltersTypeConfig
  )) {
    if (
      (typeof filterConfig === 'function' && filterConfig(group)) ||
      group.groupType === filterConfig
    ) {
      return eventGroupFilterType as WorkflowHistoryEventFilteringType;
    }
  }

  return 'WORKFLOW';
}

export default getEventGroupFilteringType;
