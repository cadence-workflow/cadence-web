import { type EventDetailsEntries } from '../workflow-history-event-details/workflow-history-event-details.types';
import { type EventDetailsTabContent } from '../workflow-history-group-details/workflow-history-group-details.types';
import { type WorkflowDiagnosticsIssue } from '../workflow-history.types';

export default function getSummaryTabContentEntry({
  groupId,
  summaryDetails,
  diagnosticsIssues,
}: {
  groupId: string;
  summaryDetails: EventDetailsEntries;
  diagnosticsIssues?: Array<WorkflowDiagnosticsIssue>;
}): [string, EventDetailsTabContent] {
  return [
    `summary_${groupId}`,
    {
      eventDetails: summaryDetails,
      eventLabel: 'Summary',
      ...(diagnosticsIssues &&
        diagnosticsIssues.length > 0 && { diagnosticsIssues }),
    },
  ];
}
