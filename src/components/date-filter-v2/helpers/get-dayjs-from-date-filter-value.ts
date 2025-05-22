import dayjs from '@/utils/datetime/dayjs';

import { DATE_FILTER_RELATIVE_VALUES } from '../date-filter-v2.constants';
import { type DateFilterValue } from '../date-filter-v2.types';

export default function getDayjsFromDateFilterValue(
  v: DateFilterValue,
  now: dayjs.Dayjs
) {
  if (v instanceof Date) {
    return dayjs(v);
  }

  if (v === 'now') {
    return now;
  }

  return now.subtract(
    DATE_FILTER_RELATIVE_VALUES[v].durationSeconds,
    'seconds'
  );
}
