import formatTickDuration from '../format-tick-duration';

describe(formatTickDuration.name, () => {
  it('should return milliseconds format for durations less than 1 second', () => {
    expect(formatTickDuration(0)).toBe('0ms');
    expect(formatTickDuration(100)).toBe('100ms');
    expect(formatTickDuration(500)).toBe('500ms');
    expect(formatTickDuration(999)).toBe('999ms');
  });

  it('should return seconds format for durations less than 1 minute', () => {
    expect(formatTickDuration(1000)).toBe('1s');
    expect(formatTickDuration(5000)).toBe('5s');
    expect(formatTickDuration(30000)).toBe('30s');
    expect(formatTickDuration(59000)).toBe('59s');
  });

  it('should return seconds with milliseconds for durations less than 1 minute when milliseconds are present', () => {
    expect(formatTickDuration(1500)).toBe('1s 500ms');
    expect(formatTickDuration(5234)).toBe('5s 234ms');
    expect(formatTickDuration(30500)).toBe('30s 500ms');
  });

  it('should return minutes format for durations less than 1 hour', () => {
    expect(formatTickDuration(60000)).toBe('1m');
    expect(formatTickDuration(120000)).toBe('2m');
    expect(formatTickDuration(300000)).toBe('5m');
    expect(formatTickDuration(3540000)).toBe('59m');
  });

  it('should return minutes with seconds for durations less than 1 hour when seconds are present', () => {
    expect(formatTickDuration(61000)).toBe('1m 1s');
    expect(formatTickDuration(125000)).toBe('2m 5s');
    expect(formatTickDuration(305000)).toBe('5m 5s');
    expect(formatTickDuration(3545000)).toBe('59m 5s');
  });

  it('should not include milliseconds when minutes are present', () => {
    // When minutes > 0, only minutes and seconds are shown (no milliseconds)
    expect(formatTickDuration(61500)).toBe('1m 1s');
    expect(formatTickDuration(125234)).toBe('2m 5s');
  });

  it('should return hours format for durations 1 hour or more', () => {
    expect(formatTickDuration(3600000)).toBe('1h');
    expect(formatTickDuration(7200000)).toBe('2h');
    expect(formatTickDuration(18000000)).toBe('5h');
  });

  it('should return hours with minutes for durations 1 hour or more when minutes are present', () => {
    expect(formatTickDuration(3660000)).toBe('1h 1m');
    expect(formatTickDuration(7320000)).toBe('2h 2m');
    expect(formatTickDuration(18060000)).toBe('5h 1m');
    expect(formatTickDuration(35940000)).toBe('9h 59m');
  });

  it('should not include minutes when they are 0', () => {
    expect(formatTickDuration(3600000)).toBe('1h');
    expect(formatTickDuration(7200000)).toBe('2h');
    expect(formatTickDuration(3605000)).toBe('1h');
  });

  it('should not include seconds when hours are present', () => {
    expect(formatTickDuration(3661000)).toBe('1h 1m');
    expect(formatTickDuration(7325000)).toBe('2h 2m');
  });

  it('should handle fractional milliseconds correctly', () => {
    // dayjs.duration rounds down, so these should work as expected
    expect(formatTickDuration(0.5)).toBe('0ms');
    expect(formatTickDuration(0.9)).toBe('0ms');
  });
});
