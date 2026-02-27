import { type HistoryEventsGroup } from '../../workflow-history-v2.types';
import { WORKFLOW_HISTORY_EVENT_GROUP_TYPE_TO_CATEGORY_MAP } from '../workflow-history-filters-menu.constants';
import { type EventGroupCategoryFilterValue } from '../workflow-history-filters-menu.types';

const filterGroupsByCategory = (
  { groupType }: HistoryEventsGroup,
  { historyEventTypes }: EventGroupCategoryFilterValue
) =>
  historyEventTypes
    ? historyEventTypes.includes(
        WORKFLOW_HISTORY_EVENT_GROUP_TYPE_TO_CATEGORY_MAP[groupType]
      )
    : true;

export default filterGroupsByCategory;
