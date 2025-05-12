import { DATE_FILTER_RELATIVE_VALUES } from '../date-filter-v2.constants';
import { type RelativeDateFilterValue } from '../date-filter-v2.types';

export default function isRelativeDateFilterValue(
  v: any
): v is RelativeDateFilterValue {
  return Object.hasOwn(DATE_FILTER_RELATIVE_VALUES, v);
}
