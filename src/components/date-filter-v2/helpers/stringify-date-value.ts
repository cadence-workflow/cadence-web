import dayjs from '@/utils/datetime/dayjs';

import { type DateValue } from '../date-filter-v2.types';

export default function stringifyDateValue(v: DateValue): string {
  const now = dayjs();

  if (v instanceof dayjs.Dayjs)
    return v.format(
      v.isSame(now, 'year') ? 'DD MMM, HH:mm:ss z' : 'DD MMM YYYY, HH:mm:ss z'
    );

  return v;
}
