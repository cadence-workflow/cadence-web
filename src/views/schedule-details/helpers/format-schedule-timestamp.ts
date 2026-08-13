import formatDate from '@/utils/data-formatters/format-date';
import formatTimestampToDatetime from '@/utils/data-formatters/format-timestamp-to-datetime';

export function formatScheduleTimestamp(
  timestamp:
    | { seconds: number | string; nanos: number | string }
    | null
    | undefined
) {
  const datetime = formatTimestampToDatetime(timestamp);
  if (!datetime) {
    return null;
  }

  return formatDate(datetime.valueOf());
}
