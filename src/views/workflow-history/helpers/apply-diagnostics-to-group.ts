import {
  type HistoryEventsGroup,
  type WorkflowDiagnosticsIssuesByEventId,
} from '../workflow-history.types';

export default function applyDiagnosticsToGroup<G extends HistoryEventsGroup>(
  group: G,
  diagnosticsIssuesByEventId: WorkflowDiagnosticsIssuesByEventId
): G {
  const nextIssues = group.events.flatMap(
    (event) =>
      diagnosticsIssuesByEventId[event.eventId ?? event.computedEventId] ?? []
  );
  const currentIssues = group.diagnosticsIssues ?? [];

  if (
    nextIssues.length === currentIssues.length &&
    nextIssues.every((issue, index) => issue === currentIssues[index])
  ) {
    return group;
  }

  if (nextIssues.length === 0) {
    const { diagnosticsIssues: _removed, ...rest } = group;
    return rest as G;
  }

  return { ...group, diagnosticsIssues: nextIssues };
}
