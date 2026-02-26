import { DATE_FILTER_RELATIVE_VALUES } from '../date-filter.constants';
import { type RelativeDateFilterValue } from '../date-filter.types';

export default function isRelativeDateFilterValue(
  v: any
): v is RelativeDateFilterValue {
  return Object.hasOwn(DATE_FILTER_RELATIVE_VALUES, v);
}
