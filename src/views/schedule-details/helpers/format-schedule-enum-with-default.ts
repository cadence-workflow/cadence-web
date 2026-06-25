import formatEnum from '@/utils/data-formatters/format-enum';

export function formatScheduleEnumWithDefault(
  value: string | null | undefined,
  prefix: string,
  defaultValue: string
) {
  const isEmpty = !value;
  const formatted = formatEnum(
    isEmpty ? defaultValue : value,
    prefix,
    'pascal'
  );

  if (!formatted) {
    return null;
  }

  return isEmpty ? `Default (${formatted})` : formatted;
}
