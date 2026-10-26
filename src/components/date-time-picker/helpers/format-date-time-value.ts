import dayjs from '@/utils/datetime/dayjs';

import { type DateTimeDisplayFormat } from '../date-time-picker.types';

export default function formatDateTimeValue(
  value: string | undefined,
  displayFormat: DateTimeDisplayFormat
): string {
  if (!value) return '';
  const parsed = dayjs(value);
  if (!parsed.isValid()) return '';
  return parsed.format(displayFormat);
}
