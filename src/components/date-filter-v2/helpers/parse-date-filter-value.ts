import dayjs from '@/utils/datetime/dayjs';

import { type DateFilterValue } from '../date-filter-v2.types';

import isRelativeDateFilterValue from './is-relative-date-filter-value';

export default function parseDateFilterValue(
  v: string,
  fallback: DateFilterValue
): DateFilterValue {
  if (isRelativeDateFilterValue(v)) return v;
  const day = dayjs(v);
  return day.isValid() ? day.toDate() : fallback;
}
