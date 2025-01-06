import dayjs from '../dayjs';

describe('dayjs utility', () => {
  it('should format date using advancedFormat plugin', () => {
    const date = dayjs('2024-05-25');
    expect(date.format('MMMM Do YYYY')).toBe('May 25th 2024');
  });

  it('should calculate relative time using relativeTime plugin', () => {
    const now = dayjs();
    const futureDate = now.add(2, 'day');
    expect(futureDate.from(now)).toBe('in 2 days');
  });

  it('should calculate duration using duration plugin', () => {
    const duration = dayjs.duration({ hours: 2, minutes: 30 });
    expect(duration.humanize()).toBe('3 hours');
  });

  it('should handle UTC time using utc plugin', () => {
    const date = dayjs.utc('2024-05-25T00:00:00Z');
    expect(date.format()).toBe('2024-05-25T00:00:00+00:00');
    expect(date.isUTC()).toBe(true);
  });

  it('should handle timezone using timezone plugin', () => {
    const date = dayjs('2024-05-25T00:00:00Z').tz('America/New_York');
    expect(date.format()).toBe('2024-05-24T20:00:00-04:00');
  });
});
