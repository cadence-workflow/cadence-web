import parseFieldValue from '../parse-field-value';

describe(parseFieldValue.name, () => {
  it('returns text as typed, keeping spaces', () => {
    expect(parseFieldValue(' hi ', { type: 'text', required: false })).toBe(
      ' hi '
    );
  });

  it('returns a number for a number field', () => {
    expect(parseFieldValue('12.5', { type: 'number', required: false })).toBe(
      12.5
    );
  });

  it('returns undefined for a blank value', () => {
    expect(
      parseFieldValue('  ', { type: 'text', required: false })
    ).toBeUndefined();
    expect(
      parseFieldValue(undefined, { type: 'number', required: false })
    ).toBeUndefined();
  });

  it('returns undefined for a number field that is not a number', () => {
    expect(
      parseFieldValue('abc', { type: 'number', required: false })
    ).toBeUndefined();
  });
});
