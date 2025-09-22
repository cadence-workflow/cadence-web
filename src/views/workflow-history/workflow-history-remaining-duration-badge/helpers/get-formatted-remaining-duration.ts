import formatDuration from '@/utils/data-formatters/format-duration';
import dayjs from '@/utils/datetime/dayjs';

export default function getFormattedRemainingDuration(
  startTime: Date | string | number,
  expectedDurationMs: number
): string | null {
  const start = dayjs(startTime);
  const now = dayjs();
  const expectedEnd = start.add(expectedDurationMs, 'milliseconds');

  // If we've already passed the expected end time, return null
  if (now.isAfter(expectedEnd)) {
    return null;
  }

  // Calculate remaining time
  const remaining = expectedEnd.diff(now);
  const remainingDuration = dayjs.duration(remaining);
  const seconds = Math.ceil(remainingDuration.asSeconds());

  // Don't show if less than 1 second remaining
  if (seconds < 1) {
    return null;
  }

  const duration = formatDuration(
    {
      seconds: seconds.toString(),
      nanos: 0,
    },
    { separator: ' ' },
    's'
  );

  return duration;
}
