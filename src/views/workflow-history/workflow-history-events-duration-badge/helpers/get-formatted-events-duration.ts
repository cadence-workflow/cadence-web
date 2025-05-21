import formatDuration from '@/utils/data-formatters/format-duration';
import dayjs from '@/utils/datetime/dayjs';

export default function getFormattedEventsDuration(
  startTime: Date | string | number,
  endTime: Date | string | number | null | undefined
) {
  const end = endTime ? dayjs(endTime) : dayjs();
  const start = dayjs(startTime);
  const diff = end.diff(start);
  const durationObj = dayjs.duration(diff);
  return formatDuration(
    {
      seconds: durationObj.asSeconds().toString(),
      nanos: 0,
    },
    { separator: ' ' }
  );
}
