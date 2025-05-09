import dayjs from '@/utils/datetime/dayjs';

import { type DateValue } from '../date-filter-v2.types';

import isRelativeDateValue from './is-relative-date-value';

export default function parseMaybeDateValue(
  v: string,
  fallback: DateValue
): DateValue {
  if (isRelativeDateValue(v)) return v;
  const day = dayjs(v);
  return day.isValid() ? day : fallback;
}
