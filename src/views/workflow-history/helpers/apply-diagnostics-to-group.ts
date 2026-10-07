import {
  type HistoryEventsGroup,
  type WorkflowDiagnosticsIssuesByEventId,
} from '../workflow-history.types';

export default function applyDiagnosticsToGroup<G extends HistoryEventsGroup>(
  group: G,
  diagnosticsIssuesByEventId: WorkflowDiagnosticsIssuesByEventId
): G {
  const issues = group.events.flatMap(
    (event) =>
      diagnosticsIssuesByEventId[event.eventId ?? event.computedEventId] ?? []
  );

  if (issues.length === 0) {
    return group;
  }

  return { ...group, diagnosticsIssues: issues };
}
