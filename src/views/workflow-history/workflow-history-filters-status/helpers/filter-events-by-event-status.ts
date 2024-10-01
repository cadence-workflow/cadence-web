import { type HistoryEventsGroup } from '../../workflow-history.types';
import { type WorkflowHistoryFiltersStatusValue } from '../workflow-history-filters-status.types';

export default function filterEventsByEventStatus(
  group: HistoryEventsGroup,
  value: WorkflowHistoryFiltersStatusValue
) {
  const selectedGroupStatus = value.historyEventStatus;
  if (!selectedGroupStatus) return true;

  if (group.status === selectedGroupStatus) return true;

  return false;
}
