import dayjs from '@/utils/datetime/dayjs';

import { DATE_FILTER_RELATIVE_VALUES } from '../date-filter-v2.constants';
import { type DateValue } from '../date-filter-v2.types';

export default function parseDateValue(v: DateValue) {
  if (v instanceof dayjs.Dayjs) {
    return v;
  }

  if (v === 'now') {
    return dayjs();
  }

  return dayjs().subtract(
    DATE_FILTER_RELATIVE_VALUES[v].durationSeconds,
    'seconds'
  );
}
