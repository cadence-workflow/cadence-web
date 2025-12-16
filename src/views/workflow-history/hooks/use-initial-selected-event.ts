import { useMemo, useRef, useState } from 'react';

import { type UseInitialSelectedEventParams } from './use-initial-selected-event.types';

/*
 * This hook is used to search for the event within event groups. It captures the first selected event when the component is mounted
 * and keeps searching for the event in all event groups until it is found.
 * Afterwards it return the index of the group in the filtered set of event groups that is presented on the UI and retrun undefined if filtered groups do not contain the event/group.
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
      filteredEventGroupsEntries[foundGroupIndexRef.current]?.[0] === groupId
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
