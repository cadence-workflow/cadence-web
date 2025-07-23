export default function getSortableEventId(eventId: string | null | undefined) {
  if (!eventId) return Number.MAX_SAFE_INTEGER;
  const numericEventId = parseInt(eventId, 10);
  if (isNaN(numericEventId)) return Number.MAX_SAFE_INTEGER;
  return numericEventId;
}
