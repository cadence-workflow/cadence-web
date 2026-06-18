import formatDate from '@/utils/data-formatters/format-date';
import formatDuration from '@/utils/data-formatters/format-duration';
import formatEnum from '@/utils/data-formatters/format-enum';
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

export function formatScheduleDuration(
  duration: { seconds: number | string; nanos: number } | null | undefined
) {
  if (!duration) {
    return null;
  }

  return formatDuration({
    seconds: String(duration.seconds),
    nanos: duration.nanos,
  });
}

export function formatScheduleEnum(
  value: string | null | undefined,
  prefix: string
) {
  return formatEnum(value, prefix, 'pascal');
}

export function formatBooleanValue(value: boolean | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return value ? 'Yes' : 'No';
}
