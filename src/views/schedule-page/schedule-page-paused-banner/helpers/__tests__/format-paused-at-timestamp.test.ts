import { formatScheduleTimestamp } from '@/views/schedule-details/helpers/format-schedule-timestamp';

import formatPausedAtTimestamp from '../format-paused-at-timestamp';

describe(formatPausedAtTimestamp.name, () => {
  it('returns null for missing timestamp', () => {
    expect(formatPausedAtTimestamp(null)).toBeNull();
    expect(formatPausedAtTimestamp(undefined)).toBeNull();
  });

  it('formats timestamp for the paused banner', () => {
    const timestamp = { seconds: '1704112496', nanos: 0 };
    const formatted = formatPausedAtTimestamp(timestamp);

    expect(formatted).toMatch(/Jan 1, 2024, \d{1,2}:\d{2}:\d{2}\.\d{2} (AM|PM) UTC/);
    expect(formatted).not.toEqual(formatScheduleTimestamp(timestamp));
  });
});
