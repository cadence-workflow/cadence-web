import sortedIndexBy from 'lodash/sortedIndexBy';

import { type ExtendedHistoryEvent } from '../workflow-history-v2.types';

export default function placeEventInGroupEvents(
  event: ExtendedHistoryEvent,
  events: ExtendedHistoryEvent[]
) {
  const sortedEvents = [...events];
  sortedEvents.splice(
    sortedIndexBy(sortedEvents, event, (e) =>
      e?.eventId ? parseInt(e?.eventId) : 0
    ),
    0,
    event
  );
  return sortedEvents;
}
