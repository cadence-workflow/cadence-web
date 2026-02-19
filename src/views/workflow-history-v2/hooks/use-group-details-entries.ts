import { useMemo } from 'react';

import generateHistoryGroupDetails from '../helpers/generate-history-group-details';
import getSummaryTabContentEntry from '../helpers/get-summary-tab-content-entry';
import { type HistoryEventsGroup } from '../workflow-history-v2.types';

export default function useGroupDetailsEntries(eventGroup: HistoryEventsGroup) {
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
      ...(groupSummaryDetails.length > 0 &&
      groupDetailsEntries.length > 1 &&
      eventGroup.firstEventId
        ? [
            getSummaryTabContentEntry({
              groupId: eventGroup.firstEventId,
              summaryDetails: groupSummaryDetails,
            }),
          ]
        : []),
      ...groupDetailsEntries,
    ],
    [eventGroup.firstEventId, groupDetailsEntries, groupSummaryDetails]
  );

  return {
    groupDetailsEntries,
    summaryDetailsEntries,
    groupSummaryDetails,
    groupDetailsEntriesWithSummary,
  };
}
