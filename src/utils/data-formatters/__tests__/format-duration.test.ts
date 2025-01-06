import { type Duration } from '@/__generated__/proto-ts/google/protobuf/Duration';

import formatDuration from '../format-duration';

describe('formatDuration', () => {
  it('should return "0s" for null duration', () => {
    expect(formatDuration(null)).toBe('0s');
  });

  it('should format duration with only seconds', () => {
    const duration: Duration = { seconds: '3600', nanos: 0 };
    expect(formatDuration(duration)).toBe('1h');
  });

  it('should format duration with only nanoseconds', () => {
    const duration: Duration = { seconds: '0', nanos: 500000000 };
    expect(formatDuration(duration)).toBe('500ms');
  });

  it('should format duration with large values', () => {
    const duration: Duration = { seconds: '31556952', nanos: 0 };
    expect(formatDuration(duration)).toBe('1y, 5h, 49m, 12s');
  });

  it('should format duration with sub milliseconds', () => {
    const duration: Duration = { seconds: '61', nanos: 123456789 };
    expect(formatDuration(duration)).toBe('1m, 1s, 123.456789ms');
  });
});
