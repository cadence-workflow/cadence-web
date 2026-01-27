import { type EventDetailsEntries } from '../workflow-history-event-details/workflow-history-event-details.types';
import { type EventDetailsTabContent } from '../workflow-history-group-details/workflow-history-group-details.types';

export default function getSummaryTabContentEntry({
  groupId,
  summaryDetails,
}: {
  groupId: string;
  summaryDetails: EventDetailsEntries;
}): [string, EventDetailsTabContent] {
  return [
    `summary_${groupId}`,
    {
      eventDetails: summaryDetails,
      eventLabel: 'Summary',
    },
  ];
}
