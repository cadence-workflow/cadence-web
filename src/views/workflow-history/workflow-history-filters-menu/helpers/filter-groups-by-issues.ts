import scopeDiagnosticsToGroup from '../../helpers/scope-diagnostics-to-group';
import {
  type HistoryEventsGroup,
  type WorkflowHistoryPageContextType,
} from '../../workflow-history.types';
import { type EventGroupIssuesFilterValue } from '../workflow-history-filters-menu.types';

const filterGroupsByIssues = (
  group: HistoryEventsGroup,
  { historyEventIssues }: EventGroupIssuesFilterValue,
  context: WorkflowHistoryPageContextType
) => {
  if (!historyEventIssues) return true;

  return (
    Object.keys(
      scopeDiagnosticsToGroup(group.events, context.diagnosticsByEventId)
    ).length > 0
  );
};

export default filterGroupsByIssues;
