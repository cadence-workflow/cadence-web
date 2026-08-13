export default function getScheduleDetailsMapBadgeLabels(
  values: Record<string, unknown> | null | undefined
): string[] {
  if (!values) {
    return [];
  }

  return Object.entries(values)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
}
