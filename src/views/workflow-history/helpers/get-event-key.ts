// UI key for an event: the persisted eventId, or the computedEventId for
// pending events (eventId null). Not a Cadence event id; never send it to the API.
export default function getEventKey(
  event:
    | { eventId: string; computedEventId?: never }
    | { eventId: null; computedEventId: string }
): string {
  return event.eventId === null ? event.computedEventId : event.eventId;
}
