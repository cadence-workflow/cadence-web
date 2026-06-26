import formatTimestampToDatetime from '@/utils/data-formatters/format-timestamp-to-datetime';
import dayjs from '@/utils/datetime/dayjs';

export default function formatPausedAtTimestamp(
  timestamp:
    | { seconds: number | string; nanos: number | string }
    | null
    | undefined
) {
  const datetime = formatTimestampToDatetime(timestamp);
  if (!datetime) {
    return null;
  }

  const date = dayjs(datetime);
  const centiseconds = String(Math.floor(date.millisecond() / 10)).padStart(2, '0');

  return `${date.format('MMM D, YYYY, h:mm:ss')}.${centiseconds} ${date.format('A z')}`;
}
