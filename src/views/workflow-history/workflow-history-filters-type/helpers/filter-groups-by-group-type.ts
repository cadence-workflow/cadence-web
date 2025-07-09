import { type HistoryEventsGroup } from '../../workflow-history.types';
import { WORKFLOW_HISTORY_GROUP_TYPE_TO_FILTERING_TYPE } from '../workflow-history-filters-type.constants';
import { type WorkflowHistoryFiltersTypeValue } from '../workflow-history-filters-type.types';

const filterGroupsByGroupType = function (
  group: HistoryEventsGroup,
  value: WorkflowHistoryFiltersTypeValue
): boolean {
  if (!value.historyEventTypes) {
    return true;
  }

  return value.historyEventTypes.includes(
    WORKFLOW_HISTORY_GROUP_TYPE_TO_FILTERING_TYPE[group.groupType]
  );
};

export default filterGroupsByGroupType;
