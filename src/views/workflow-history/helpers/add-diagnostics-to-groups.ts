import {
  type HistoryEventsGroupsMap,
  type WorkflowDiagnosticsIssuesByEventId,
} from '../workflow-history.types';

import applyDiagnosticsToGroup from './apply-diagnostics-to-group';

export default function addDiagnosticsToGroups(
  groups: HistoryEventsGroupsMap,
  diagnosticsIssuesByEventId: WorkflowDiagnosticsIssuesByEventId
): HistoryEventsGroupsMap {
  if (Object.keys(diagnosticsIssuesByEventId).length === 0) {
    return groups;
  }

  return Object.fromEntries(
    Object.entries(groups).map(([groupId, group]) => [
      groupId,
      applyDiagnosticsToGroup(group, diagnosticsIssuesByEventId),
    ])
  );
}
