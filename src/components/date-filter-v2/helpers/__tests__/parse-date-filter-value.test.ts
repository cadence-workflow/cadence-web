import dayjs from '@/utils/datetime/dayjs';

import { type DateFilterValue } from '../../date-filter-v2.types';
import parseDateFilterValue from '../parse-date-filter-value';

// Mock is-relative-date-filter-value
jest.mock('../is-relative-date-filter-value', () => ({
  __esModule: true,
  default: (v: string) => v.startsWith('now-'),
}));

describe('parseDateFilterValue', () => {
  it('returns the value as is for relative date values', () => {
    const fallback: DateFilterValue = 'now';
    expect(parseDateFilterValue('now-5m', fallback)).toBe('now-5m');
    expect(parseDateFilterValue('now-1h', fallback)).toBe('now-1h');
  });

  it('parses string dates into dayjs objects when format is valid', () => {
    const fallback: DateFilterValue = 'now';
    const result = parseDateFilterValue('2023-05-23T10:30:00.000Z', fallback);
    expect(dayjs.isDayjs(result)).toBe(true);
    expect((result as dayjs.Dayjs).format('YYYY-MM-DD')).toBe('2023-05-23');
  });

  it('returns the fallback when date format is invalid', () => {
    const fallback = dayjs('2023-01-01');
    const result = parseDateFilterValue('invalid-date', fallback);
    expect(result).toBe(fallback);
  });

  it('returns the fallback for empty strings', () => {
    const fallback: DateFilterValue = 'now';
    expect(parseDateFilterValue('', fallback)).toBe(fallback);
  });
});
