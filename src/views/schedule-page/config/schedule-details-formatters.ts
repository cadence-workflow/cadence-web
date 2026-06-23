import formatDate from '@/utils/data-formatters/format-date';
import formatDuration from '@/utils/data-formatters/format-duration';
import formatEnum from '@/utils/data-formatters/format-enum';
import formatPayload from '@/utils/data-formatters/format-payload';
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

export function formatScheduleMemo(
  memo: { fields: Record<string, { data?: string | null }> } | null | undefined
): string | null {
  if (!memo?.fields) return null;
  const values = Object.values(memo.fields)
    .map((payload) => formatPayload(payload))
    .filter((v) => v !== null && v !== undefined)
    .map((v) => (typeof v === 'object' ? JSON.stringify(v) : String(v)));
  if (values.length === 0) return null;
  return values.join(', ');
}

export function formatScheduleInput(
  input: { data?: string | null } | null | undefined
) {
  return formatPayload(input);
}
