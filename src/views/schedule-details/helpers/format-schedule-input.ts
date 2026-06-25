import formatPayload from '@/utils/data-formatters/format-payload';

export function formatScheduleInput(
  input: { data?: string | null } | null | undefined
) {
  return formatPayload(input);
}
