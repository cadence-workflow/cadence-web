import { useMemo, useState } from 'react';

import getHistoryEventGroupId from '../helpers/get-history-event-group-id';

import { type UseInitialSelectedEventParams } from './use-initial-selected-event.types';

export default function useInitialSelectedEvent({
  selectedEventId,
  events,
  filteredEventGroupsEntries,
}: UseInitialSelectedEventParams) {
  const [initialEventId] = useState(selectedEventId);

  const initialEvent = useMemo(() => {
    if (!initialEventId) return undefined;
    return events.find((e) => e.eventId === initialEventId);
  }, [events, initialEventId]);

  const shouldSearchForInitialEvent = initialEventId !== undefined;
  const initialEventFound = initialEvent !== undefined;

  const initialEventGroupIndex = useMemo(() => {
    if (!initialEvent) return undefined;
    const groupId = getHistoryEventGroupId(initialEvent);
    const index = filteredEventGroupsEntries.findIndex(
      ([id]) => id === groupId
    );
    return index > -1 ? index : undefined;
  }, [initialEvent, filteredEventGroupsEntries]);

  return {
    shouldSearchForInitialEvent,
    initialEventFound,
    initialEventGroupIndex,
  };
}
