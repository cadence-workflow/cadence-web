import { type WorkflowEventStatus } from '../../workflow-history-event-status-badge/workflow-history-event-status-badge.types';
import { type HistoryEventsGroup } from '../../workflow-history.types';
import {
  type HistoryEventFilterStatus,
  type WorkflowHistoryFiltersStatusValue,
} from '../workflow-history-filters-status.types';

export default function filterEventsByEventStatus(
  group: HistoryEventsGroup,
  value: WorkflowHistoryFiltersStatusValue
) {
  const historyFiltersStatuses = value.historyEventStatuses;
  if (!historyFiltersStatuses) return true;

  const workflowEventStatuses = historyFiltersStatuses.reduce(
    (acc: WorkflowEventStatus[], currentValue: HistoryEventFilterStatus) => {
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
