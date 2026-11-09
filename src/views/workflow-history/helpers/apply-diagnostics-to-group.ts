import {
  type HistoryEventsGroup,
  type WorkflowDiagnosticsIssuesByEventId,
} from '../workflow-history.types';

import getEventKey from './get-event-key';

export default function applyDiagnosticsToGroup<G extends HistoryEventsGroup>(
  group: G,
  diagnosticsIssuesByEventId: WorkflowDiagnosticsIssuesByEventId
): G {
  const issues = group.events.flatMap(
    (event) => diagnosticsIssuesByEventId[getEventKey(event)] ?? []
  );

  if (issues.length === 0) {
    return group;
  }

  return { ...group, diagnosticsIssues: issues };
}
