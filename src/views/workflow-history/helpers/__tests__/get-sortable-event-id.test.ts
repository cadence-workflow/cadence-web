import getSortableEventId from '../get-sortable-event-id';

describe('getSortableEventId', () => {
  it('should return Number.MAX_SAFE_INTEGER for empty input', () => {
    expect(getSortableEventId(null)).toBe(Number.MAX_SAFE_INTEGER);
    expect(getSortableEventId(undefined)).toBe(Number.MAX_SAFE_INTEGER);
    expect(getSortableEventId('')).toBe(Number.MAX_SAFE_INTEGER);
    expect(getSortableEventId('   ')).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('should parse valid positive integer strings', () => {
    expect(getSortableEventId('0')).toBe(0);
    expect(getSortableEventId('1')).toBe(1);
    expect(getSortableEventId('123')).toBe(123);
    expect(getSortableEventId('999999')).toBe(999999);
  });

  it('should parse valid negative integer strings', () => {
    expect(getSortableEventId('-1')).toBe(-1);
    expect(getSortableEventId('-123')).toBe(-123);
    expect(getSortableEventId('-999999')).toBe(-999999);
  });

  it('should return Number.MAX_SAFE_INTEGER for strings starting with non-digits', () => {
    expect(getSortableEventId('abc')).toBe(Number.MAX_SAFE_INTEGER);
    expect(getSortableEventId('abc123')).toBe(Number.MAX_SAFE_INTEGER);
    expect(getSortableEventId('!@#$%')).toBe(Number.MAX_SAFE_INTEGER);
    expect(getSortableEventId('😀123')).toBe(Number.MAX_SAFE_INTEGER);
    expect(getSortableEventId('\x00123')).toBe(Number.MAX_SAFE_INTEGER);
  });
});
