import formatDuration from '@/utils/data-formatters/format-duration';
import dayjs from '@/utils/datetime/dayjs';

export default function getFormattedEventsDuration(
  startTime: Date | string | number | null,
  endTime: Date | string | number | null | undefined,
  hideMs: boolean = false
) {
  const end = endTime ? dayjs(endTime) : dayjs();
  const start = dayjs(startTime);
  const diff = end.diff(start);
  const durationObj = dayjs.duration(diff);
  const seconds = Math.floor(durationObj.asSeconds());

  const duration = formatDuration(
    {
      seconds: seconds.toString(),
      nanos: (durationObj.asMilliseconds() - seconds * 1000) * 1000000,
    },
    { separator: ' ', minUnit: hideMs && seconds > 0 ? 's' : 'ms' }
  );

  return duration;
}
