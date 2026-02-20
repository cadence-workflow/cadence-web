import {
  type WorkflowEventStatus,
  type HistoryEventsGroup,
} from '../../workflow-history-v2.types';
import {
  type WorkflowHistoryGroupFilterStatus,
  type WorkflowHistoryFiltersStatusValue,
} from '../workflow-history-filters-menu.types';

export default function filterGroupsByGroupStatus(
  group: HistoryEventsGroup,
  value: WorkflowHistoryFiltersStatusValue
) {
  const historyFiltersStatuses = value.historyEventStatuses;
  if (!historyFiltersStatuses) return true;

  const workflowEventStatuses = historyFiltersStatuses.reduce(
    (
      acc: WorkflowEventStatus[],
      currentValue: WorkflowHistoryGroupFilterStatus
    ) => {
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
