import {
  type ExtendedHistoryEvent,
  type WorkflowDiagnosticsIssuesByEventId,
} from '../workflow-history.types';

export default function scopeDiagnosticsToGroup(
  events: ExtendedHistoryEvent[],
  fullMap: WorkflowDiagnosticsIssuesByEventId
): WorkflowDiagnosticsIssuesByEventId {
  const scoped: WorkflowDiagnosticsIssuesByEventId = {};

  for (const event of events) {
    const eventId = event.eventId ?? event.computedEventId;
    if (eventId && fullMap[eventId]) {
      scoped[eventId] = fullMap[eventId];
    }
  }

  return scoped;
}
