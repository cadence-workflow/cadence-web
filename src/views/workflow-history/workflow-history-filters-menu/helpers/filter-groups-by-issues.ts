import { type HistoryEventsGroup } from '../../workflow-history.types';
import { type EventGroupIssuesFilterValue } from '../workflow-history-filters-menu.types';

const filterGroupsByIssues = (
  group: HistoryEventsGroup,
  { historyEventIssues }: EventGroupIssuesFilterValue
) => {
  if (!historyEventIssues) return true;

  return group.eventsMetadata.some((m) => Boolean(m.diagnosticsIssues?.length));
};

export default filterGroupsByIssues;
