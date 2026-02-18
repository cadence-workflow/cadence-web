import formatPendingWorkflowHistoryEvent from '@/utils/data-formatters/format-pending-workflow-history-event';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import isPendingHistoryEvent from '@/views/workflow-history/workflow-history-event-details/helpers/is-pending-history-event';

import generateHistoryEventDetails from '../helpers/generate-history-event-details';
import { type EventDetailsTabContent } from '../workflow-history-group-details/workflow-history-group-details.types';
import { type HistoryEventsGroup } from '../workflow-history-v2.types';

export default function generateHistoryGroupDetails(
  eventGroup: HistoryEventsGroup
) {
  const groupDetailsEntries: Array<[string, EventDetailsTabContent]> = [],
    summaryDetailsEntries: Array<[string, EventDetailsTabContent]> = [];

  eventGroup.events.forEach((event, index) => {
    const eventId = event.eventId ?? event.computedEventId;

    const eventMetadata = eventGroup.eventsMetadata[index];
    if (!eventMetadata) return;

    const result = isPendingHistoryEvent(event)
      ? formatPendingWorkflowHistoryEvent(event)
      : formatWorkflowHistoryEvent(event);

    const eventDetails = result
      ? generateHistoryEventDetails({
          details: {
            ...result,
            ...eventMetadata.additionalDetails,
          },
          negativeFields: eventMetadata.negativeFields,
        })
      : [];

    groupDetailsEntries.push([
      eventId,
      {
        eventLabel: eventMetadata.label,
        eventDetails,
      } satisfies EventDetailsTabContent,
    ]);

    const eventSummaryDetails = eventDetails.filter((detail) =>
      eventMetadata.summaryFields?.includes(detail.path)
    );

    if (eventSummaryDetails.length > 0) {
      summaryDetailsEntries.push([
        eventId,
        {
          eventLabel: eventMetadata.label,
          eventDetails: eventSummaryDetails,
        } satisfies EventDetailsTabContent,
      ]);
    }
  });

  return {
    groupDetailsEntries,
    summaryDetailsEntries,
  };
}
