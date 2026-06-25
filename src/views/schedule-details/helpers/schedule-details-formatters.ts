import formatDate from '@/utils/data-formatters/format-date';
import formatDuration from '@/utils/data-formatters/format-duration';
import formatEnum from '@/utils/data-formatters/format-enum';
import formatTimestampToDatetime from '@/utils/data-formatters/format-timestamp-to-datetime';
import { toString as cronToString } from 'cronstrue';

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

export function formatScheduleEnumWithDefault(
  value: string | null | undefined,
  prefix: string,
  defaultValue: string
) {
  const isEmpty = !value || value.includes('INVALID');
  const formatted = formatScheduleEnum(
    isEmpty ? defaultValue : value,
    prefix
  );

  if (!formatted) {
    return null;
  }

  return isEmpty ? `Default (${formatted})` : formatted;
}

export function formatBooleanValue(value: boolean | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return value ? 'Yes' : 'No';
}

export function formatScheduleLimitValue(
  limit: number | null | undefined
): string {
  if (limit === null || limit === undefined || limit === 0) {
    return '0 (Unlimited)';
  }

  return String(limit);
}

export function formatScheduleCronExpression(
  cronExpression: string | null | undefined
) {
  if (!cronExpression) {
    return null;
  }

  try {
    return `${cronToString(cronExpression)} (${cronExpression})`;
  } catch {
    return cronExpression;
  }
}
