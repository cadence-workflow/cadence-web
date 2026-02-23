import workflowHistoryEventGroupCategoryConfig from '../../config/workflow-history-event-group-category.config';
import { type HistoryEventsGroup } from '../../workflow-history-v2.types';
import { type EventGroupCategoryFilterValue } from '../workflow-history-filters-menu.types';

const filterGroupsByGroupType = function (
  group: HistoryEventsGroup,
  value: EventGroupCategoryFilterValue
): boolean {
  if (!value.historyEventTypes) {
    return true;
  }

  const filterConfigs = value.historyEventTypes.map(
    (filteringType) => workflowHistoryEventGroupCategoryConfig[filteringType]
  );

  return filterConfigs.some((filterConfig) => {
    if (typeof filterConfig === 'function') {
      return filterConfig(group);
    }

    return group.groupType === filterConfig;
  });
};

export default filterGroupsByGroupType;
