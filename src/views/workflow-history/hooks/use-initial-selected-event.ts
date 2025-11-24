import { useMemo, useRef, useState } from 'react';

import { type UseInitialSelectedEventParams } from './use-initial-selected-event.types';

/*
 * This hook is used to search for the event and the group of the event that
 * was selected when the component is mounted. It returns a boolean indicating if the
 * initial event should be searched for, a boolean indicating if the initial
 * event was found, and the index of the group that contains the event.
 */
export default function useInitialSelectedEvent({
  selectedEventId,
  eventGroups,
  filteredEventGroupsEntries,
}: UseInitialSelectedEventParams) {
  // preserve initial event id even if prop changed.
  const [initialEventId] = useState(selectedEventId);
  const foundGroupIndexRef = useRef<number | undefined>(undefined);

  const initialEventGroupEntry = useMemo(() => {
    if (!initialEventId) return undefined;

    return Object.entries(eventGroups).find(([_, group]) =>
      group.events.find((e) => e.eventId === initialEventId)
    );
  }, [eventGroups, initialEventId]);

  const shouldSearchForInitialEvent = initialEventId !== undefined;
  const initialEventFound = initialEventGroupEntry !== undefined;

  const initialEventGroupIndex = useMemo(() => {
    if (!initialEventGroupEntry) return undefined;

    const groupId = initialEventGroupEntry[0];
    // If group index not change do not search again.
    if (
      foundGroupIndexRef.current &&
      filteredEventGroupsEntries[foundGroupIndexRef.current][0] === groupId
    )
      return foundGroupIndexRef.current;

    const index = filteredEventGroupsEntries.findIndex(
      ([id]) => id === groupId
    );
    const foundGroupIndex = index > -1 ? index : undefined;
    foundGroupIndexRef.current = foundGroupIndex;
    return foundGroupIndex;
  }, [initialEventGroupEntry, filteredEventGroupsEntries]);

  return {
    shouldSearchForInitialEvent,
    initialEventFound,
    initialEventGroupIndex,
  };
}
