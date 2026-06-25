import formatEnum from '@/utils/data-formatters/format-enum';

export function formatScheduleEnumWithDefault(
  value: string | null | undefined,
  prefix: string,
  defaultValue: string
) {
  const isEmpty = !value || value.includes('INVALID');
  const formatted = formatEnum(
    isEmpty ? defaultValue : value,
    prefix,
    'pascal'
  );

  return isEmpty ? `Default (${formatted})` : formatted;
}
