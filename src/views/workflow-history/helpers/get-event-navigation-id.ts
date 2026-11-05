// Synthetic pending events have null eventId; their computedEventId is the
// only stable navigation key. Persisted events always have eventId.
export default function getEventNavigationId(event: {
  eventId?: string | null;
  computedEventId?: string | null;
}): string | null | undefined {
  return event.eventId ?? event.computedEventId;
}
