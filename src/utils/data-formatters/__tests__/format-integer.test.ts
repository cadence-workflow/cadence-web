import formatInteger from '../format-integer';

describe('formatInteger', () => {
  it('groups digits using the requested locale', () => {
    expect(formatInteger(12472988)).toBe('12,472,988');
    expect(formatInteger(12472988, 'de-DE')).toBe('12.472.988');
  });

  it('falls back to an ungrouped string without Intl.NumberFormat', () => {
    const numberFormat = Intl.NumberFormat;
    Object.defineProperty(Intl, 'NumberFormat', {
      configurable: true,
      value: undefined,
    });

    try {
      expect(formatInteger(12472988)).toBe('12472988');
    } finally {
      Object.defineProperty(Intl, 'NumberFormat', {
        configurable: true,
        value: numberFormat,
      });
    }
  });
});
