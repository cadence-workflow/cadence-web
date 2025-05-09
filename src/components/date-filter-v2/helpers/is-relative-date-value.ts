import { DATE_FILTER_RELATIVE_VALUES } from '../date-filter-v2.constants';
import { type RelativeDateValue } from '../date-filter-v2.types';

export default function isRelativeDateValue(v: any): v is RelativeDateValue {
  return Object.hasOwn(DATE_FILTER_RELATIVE_VALUES, v);
}
