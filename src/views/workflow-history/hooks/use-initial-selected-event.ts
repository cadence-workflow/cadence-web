import { useMemo, useState } from 'react';

import getHistoryEventGroupId from '../helpers/get-history-event-group-id';

import { type UseInitialSelectedEventParams } from './use-initial-selected-event.types';

/*
 * This hook is used to search for the event and the group of the event that
 * was selected when the component is mounted. It returns a boolean indicating if the
 * initial event should be searched for, a boolean indicating if the initial
 * event was found, and the index of the group that contains the event.
 */
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
