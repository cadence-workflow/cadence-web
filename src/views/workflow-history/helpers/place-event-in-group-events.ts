import sortedIndexBy from 'lodash/sortedIndexBy';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

export default function placeEventInGroupEvents(
  event: HistoryEvent,
  events: HistoryEvent[]
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
