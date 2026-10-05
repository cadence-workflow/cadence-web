import {
  type HistoryEventsGroup,
  type HistoryGroupEventMetadata,
  type WorkflowDiagnosticsIssuesByEventId,
} from '../workflow-history.types';

export default function applyDiagnosticsToGroup<G extends HistoryEventsGroup>(
  group: G,
  diagnosticsIssuesByEventId: WorkflowDiagnosticsIssuesByEventId
): G {
  let hasChanges = false;

  const eventsMetadata = group.eventsMetadata.map((metadata, index) => {
    const event = group.events[index];
    if (!event) return metadata;

    const eventId = event.eventId ?? event.computedEventId;
    const issues = eventId ? diagnosticsIssuesByEventId[eventId] : undefined;
    const nextIssues = issues?.length ? issues : undefined;

    if (metadata.diagnosticsIssues === nextIssues) return metadata;

    hasChanges = true;
    if (nextIssues) {
      return { ...metadata, diagnosticsIssues: nextIssues };
    }
    const { diagnosticsIssues: _removed, ...rest } = metadata;
    return rest satisfies HistoryGroupEventMetadata;
  });

  return hasChanges ? { ...group, eventsMetadata } : group;
}
