import {
  type WorkflowEventStatus,
  type HistoryEventsGroup,
} from '../../workflow-history-v2.types';
import {
  type EventGroupStatus,
  type EventGroupStatusFilterValue,
} from '../workflow-history-filters-menu.types';

export default function filterGroupsByGroupStatus(
  group: HistoryEventsGroup,
  value: EventGroupStatusFilterValue
) {
  const historyFiltersStatuses = value.historyEventStatuses;
  if (!historyFiltersStatuses) return true;

  const workflowEventStatuses = historyFiltersStatuses.reduce(
    (acc: WorkflowEventStatus[], currentValue: EventGroupStatus) => {
      if (currentValue === 'PENDING') {
        acc.push('ONGOING', 'WAITING');
      } else {
        acc.push(currentValue);
      }
      return acc;
    },
    []
  );

  return workflowEventStatuses.includes(group.status);
}
