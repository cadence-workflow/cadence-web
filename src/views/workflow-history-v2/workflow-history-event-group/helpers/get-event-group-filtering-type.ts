import workflowHistoryEventGroupCategoryConfig from '../../config/workflow-history-event-group-category.config';
import { type EventGroupCategory } from '../../workflow-history-filters-menu/workflow-history-filters-menu.types';
import { type HistoryEventsGroup } from '../../workflow-history-v2.types';

// TODO @adhitya.mamallan - revisit this when we write the new grouping logic
function getEventGroupFilteringType(
  group: HistoryEventsGroup
): EventGroupCategory {
  for (const [eventGroupFilterType, filterConfig] of Object.entries(
    workflowHistoryEventGroupCategoryConfig
  )) {
    if (
      (typeof filterConfig === 'function' && filterConfig(group)) ||
      group.groupType === filterConfig
    ) {
      return eventGroupFilterType as EventGroupCategory;
    }
  }

  return 'WORKFLOW';
}

export default getEventGroupFilteringType;
