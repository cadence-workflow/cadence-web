import { useMemo, useRef, useState } from 'react';

import { type UseInitialSelectedEventParams } from './use-initial-selected-event.types';

/**
 * Hook to find the group index of the initially selected event.
 * - Stores the first provided event ID on mount, even if it changes later.
 * - Locates the event in the complete set of event groups until found.
 * - Returns the group index within the filtered event groups shown in the UI,
 *   or undefined if the event/group is not present in the filtered groups.
 */
export default function useInitialSelectedEvent({
  selectedEventId,
  eventGroups,
  filteredEventGroupsEntries,
}: UseInitialSelectedEventParams) {
  // preserve initial event id even if props change
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
    // If group index has not changed do not search again
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
