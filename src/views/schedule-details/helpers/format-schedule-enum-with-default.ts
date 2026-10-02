export function formatScheduleEnumWithDefault(
  value: string | null | undefined,
  labelMap: Record<string, string>,
  defaultValue: string
) {
  const isEmpty = !value || value.includes('INVALID');
  const enumValue = isEmpty ? defaultValue : value;
  const formatted = labelMap[enumValue] ?? enumValue;

  return isEmpty ? `Default (${formatted})` : formatted;
}
