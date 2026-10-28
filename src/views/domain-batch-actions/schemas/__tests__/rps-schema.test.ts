import { rpsSchema } from '../rps-schema';

describe('RPS integer and range validation', () => {
  it.each([1, 999])('accepts valid RPS %p', (value) => {
    expect(rpsSchema.parse(value)).toBe(value);
  });

  it.each([0, -1, 1000])(
    'keeps the custom range message for integer %p',
    (value) => {
      expect(rpsSchema.safeParse(value).error?.issues).toEqual([
        expect.objectContaining({ message: 'Must be between 1 and 999' }),
      ]);
    }
  );

  it.each([1.5, -1.5, 1000.5])(
    'reports an integer error first for fractional input %p',
    (value) => {
      const result = rpsSchema.safeParse(value);
      expect(result.error?.issues[0]).toEqual(
        expect.objectContaining({ code: 'invalid_type', expected: 'int' })
      );
      expect(result.error?.issues[0]?.message).not.toBe(
        'Must be between 1 and 999'
      );
    }
  );

  it.each([Number.MAX_SAFE_INTEGER + 1, 1e20])(
    'allows native safe-integer validation to precede the range error for %p',
    (value) => {
      const result = rpsSchema.safeParse(value);
      expect(result.error?.issues[0]).toEqual(
        expect.objectContaining({
          code: 'too_big',
          maximum: Number.MAX_SAFE_INTEGER,
        })
      );
      expect(result.error?.issues[0]?.message).not.toBe(
        'Must be between 1 and 999'
      );
      expect(result.error?.issues).toContainEqual(
        expect.objectContaining({ message: 'Must be between 1 and 999' })
      );
    }
  );
});
