import { type HistoryEventsGroup } from '../../workflow-history.types';
import { type WorkflowHistoryFiltersStatusValue } from '../workflow-history-filters-status.types';

export default function filterEventsByEventStatus(
  group: HistoryEventsGroup,
  value: WorkflowHistoryFiltersStatusValue
) {
  const selectedGroupStatuses = value.historyEventStatuses;
  if (!selectedGroupStatuses) return true;

  return selectedGroupStatuses.includes(group.status);
}
