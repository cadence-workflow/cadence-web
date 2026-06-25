import formatEnum from '@/utils/data-formatters/format-enum';

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
