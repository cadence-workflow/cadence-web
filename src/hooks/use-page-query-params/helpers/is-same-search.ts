import isEqual from 'lodash/isEqual';
import queryString from 'query-string';

// Compare values because equivalent query strings can use different encoding.
export default function isSameSearch(a: string, b: string): boolean {
  return isEqual(queryString.parse(a), queryString.parse(b));
}
