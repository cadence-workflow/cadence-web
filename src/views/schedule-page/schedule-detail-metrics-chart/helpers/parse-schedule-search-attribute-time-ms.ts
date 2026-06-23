export default function parseScheduleSearchAttributeTimeMs(
  value: unknown
): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return value.getTime();
  }

  if (typeof value === 'string') {
    const numericValue = Number(value);

    if (Number.isFinite(numericValue)) {
      return numericValue;
    }

    const parsedMs = Date.parse(value);

    if (Number.isFinite(parsedMs)) {
      return parsedMs;
    }
  }

  return null;
}
