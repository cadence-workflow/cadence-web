import { useMemo } from 'react';

import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import generateHistoryGroupDetails from '../helpers/generate-history-group-details';
import getSummaryTabContentEntry from '../workflow-history-event-group/helpers/get-summary-tab-content-entry';
import WorkflowHistoryGroupDetails from '../workflow-history-group-details/workflow-history-group-details';
import { type Props as WorkflowHistoryProps } from '../workflow-history-v2.types';

export default function WorkflowHistoryTimelineEventGroup({
  eventGroup,
  decodedPageUrlParams,
  onClose,
}: {
  eventGroup: HistoryEventsGroup;
  decodedPageUrlParams: WorkflowHistoryProps['params'];
  onClose: () => void;
}) {
  const { firstEventId } = eventGroup;

  const { groupDetailsEntries, summaryDetailsEntries } = useMemo(
    () => generateHistoryGroupDetails(eventGroup),
    [eventGroup]
  );

  const groupSummaryDetails = useMemo(
    () =>
      summaryDetailsEntries.flatMap(
        ([_eventId, { eventDetails }]) => eventDetails
      ),
    [summaryDetailsEntries]
  );

  const groupDetailsEntriesWithSummary = useMemo(
    () => [
      ...(groupSummaryDetails.length > 0 && groupDetailsEntries.length > 1
        ? [
            getSummaryTabContentEntry({
              groupId: firstEventId ?? 'unknown',
              summaryDetails: groupSummaryDetails,
            }),
          ]
        : []),
      ...groupDetailsEntries,
    ],
    [firstEventId, groupDetailsEntries, groupSummaryDetails]
  );

  return (
    <WorkflowHistoryGroupDetails
      groupDetailsEntries={groupDetailsEntriesWithSummary}
      initialEventId={undefined}
      workflowPageParams={decodedPageUrlParams}
      onClose={onClose}
    />
  );
}
