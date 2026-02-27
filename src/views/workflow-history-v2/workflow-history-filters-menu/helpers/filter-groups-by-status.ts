import { type HistoryEventsGroup } from '../../workflow-history-v2.types';
import { WORKFLOW_HISTORY_EVENT_STATUS_TO_GROUP_STATUS_MAP } from '../workflow-history-filters-menu.constants';
import { type EventGroupStatusFilterValue } from '../workflow-history-filters-menu.types';

const filterGroupsByStatus = (
  { status }: HistoryEventsGroup,
  { historyEventStatuses }: EventGroupStatusFilterValue
) =>
  historyEventStatuses
    ? historyEventStatuses.includes(
        WORKFLOW_HISTORY_EVENT_STATUS_TO_GROUP_STATUS_MAP[status]
      )
    : true;

export default filterGroupsByStatus;
