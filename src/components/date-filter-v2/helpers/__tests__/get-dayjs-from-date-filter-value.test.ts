import dayjs from '@/utils/datetime/dayjs';

import { DATE_FILTER_RELATIVE_VALUES } from '../../date-filter-v2.constants';
import { type RelativeDateFilterValue } from '../../date-filter-v2.types';
import getDayjsFromDateFilterValue from '../get-dayjs-from-date-filter-value';

describe('getDayjsFromDateFilterValue', () => {
  const now = dayjs('2023-05-25T12:00:00.000Z');

  it('converts a Date object to a dayjs object', () => {
    const date = new Date('2023-05-23T10:30:00.000Z');
    const result = getDayjsFromDateFilterValue(date, now);
    expect(result.isSame(dayjs(date))).toBe(true);
  });

  it('returns the "now" value when input is "now"', () => {
    const result = getDayjsFromDateFilterValue('now', now);
    expect(result).toBe(now);
  });

  it('calculates correct relative times for relative date values', () => {
    // Test each relative date value
    Object.entries(DATE_FILTER_RELATIVE_VALUES).forEach(
      ([key, { durationSeconds }]) => {
        const result = getDayjsFromDateFilterValue(
          key as RelativeDateFilterValue,
          now
        );

        const expected = now.subtract(durationSeconds, 'seconds');

        expect(result.unix()).toBe(expected.unix());
      }
    );
  });

  it('correctly calculates specific relative date examples', () => {
    // 5 minutes ago
    const fiveMinAgo = getDayjsFromDateFilterValue('now-5m', now);
    expect(fiveMinAgo.unix()).toBe(now.subtract(5, 'minutes').unix());

    // 1 hour ago
    const oneHourAgo = getDayjsFromDateFilterValue('now-1h', now);
    expect(oneHourAgo.unix()).toBe(now.subtract(1, 'hour').unix());

    // 1 day ago
    const oneDayAgo = getDayjsFromDateFilterValue('now-1d', now);
    expect(oneDayAgo.unix()).toBe(now.subtract(1, 'day').unix());
  });
});
