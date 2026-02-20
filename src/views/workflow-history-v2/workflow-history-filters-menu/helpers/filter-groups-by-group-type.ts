import workflowHistoryGroupFilterTypeConfig from '../../config/workflow-history-filters-type.config';
import { type HistoryEventsGroup } from '../../workflow-history-v2.types';
import { type WorkflowHistoryFiltersTypeValue } from '../workflow-history-filters-menu.types';

const filterGroupsByGroupType = function (
  group: HistoryEventsGroup,
  value: WorkflowHistoryFiltersTypeValue
): boolean {
  if (!value.historyEventTypes) {
    return true;
  }

  const filterConfigs = value.historyEventTypes.map(
    (filteringType) => workflowHistoryGroupFilterTypeConfig[filteringType]
  );

  return filterConfigs.some((filterConfig) => {
    if (typeof filterConfig === 'function') {
      return filterConfig(group);
    }

    return group.groupType === filterConfig;
  });
};

export default filterGroupsByGroupType;
