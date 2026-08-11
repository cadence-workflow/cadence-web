import formatDuration from '@/utils/data-formatters/format-duration';
import dayjs from '@/utils/datetime/dayjs';

export default function getFormattedRemainingDuration(
  expectedEndTimeMs: number
): string | null {
  const now = dayjs();
  const expectedEnd = dayjs(expectedEndTimeMs);

  if (now.isAfter(expectedEnd)) {
    return null;
  }

  const remainingDurationMs = expectedEnd.diff(now);

  // Round up, to compensate for the rounding-down in the events duration badge
  const seconds = Math.ceil(remainingDurationMs / 1000);
  if (seconds < 1) {
    return null;
  }

  const duration = formatDuration(
    {
      seconds: seconds.toString(),
      nanos: 0,
    },
    { separator: ' ', minUnit: 's' }
  );

  return duration;
}
