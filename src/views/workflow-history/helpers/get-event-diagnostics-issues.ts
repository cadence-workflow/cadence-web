import {
  type HistoryEventsGroup,
  type WorkflowDiagnosticsIssue,
} from '../workflow-history.types';

import getCanonicalEventIdFromIssueMetadata from './get-canonical-event-id-from-issue-metadata';

export default function getEventDiagnosticsIssues(
  group: HistoryEventsGroup,
  eventId: string
): Array<WorkflowDiagnosticsIssue> {
  return (group.diagnosticsIssues ?? []).filter(
    (issue) => getCanonicalEventIdFromIssueMetadata(issue.metadata) === eventId
  );
}
