import dayjs from '@/utils/datetime/dayjs';

import { type DateTimeDisplayFormat } from '../date-time-picker.types';

/** Strict display-format parse. Rejects ISO paste. */
export default function parseDateTimeValue(
  text: string,
  displayFormat: DateTimeDisplayFormat
): string | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  const parsed = dayjs(trimmed, displayFormat, true);
  if (!parsed.isValid()) return undefined;
  return parsed.toISOString();
}
