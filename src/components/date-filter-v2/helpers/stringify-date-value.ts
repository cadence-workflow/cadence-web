import dayjs from '@/utils/datetime/dayjs';

import { type DateValue } from '../date-filter-v2.types';

export default function stringifyDateValue(
  v: DateValue,
  prettyPrint?: boolean
): string {
  const now = dayjs();

  if (dayjs.isDayjs(v)) {
    if (prettyPrint)
      return v.format(
        v.isSame(now, 'year') ? 'DD MMM, HH:mm:ss z' : 'DD MMM YYYY, HH:mm:ss z'
      );
    else return v.toISOString();
  }

  return v;
}
