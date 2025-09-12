import workflowHistoryFiltersTypeConfig from '../../config/workflow-history-filters-type.config';
import { type HistoryEventsGroup } from '../../workflow-history.types';
import { type WorkflowHistoryFiltersTypeValue } from '../workflow-history-filters-type.types';

const filterGroupsByGroupType = function (
  group: HistoryEventsGroup,
  value: WorkflowHistoryFiltersTypeValue
): boolean {
  if (!value.historyEventTypes) {
    return true;
  }

  const filterConfigs = value.historyEventTypes.map(
    (filteringType) => workflowHistoryFiltersTypeConfig[filteringType]
  );

  return filterConfigs.some((filterConfig) => {
    if (typeof filterConfig === 'function') {
      return filterConfig(group);
    }

    return group.groupType === filterConfig;
  });
};

export default filterGroupsByGroupType;
