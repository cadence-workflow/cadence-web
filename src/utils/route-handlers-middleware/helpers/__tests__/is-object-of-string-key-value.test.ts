import isObjectOfStringKeyValue from '../is-object-of-string-key-value';

describe('isObjectOfStringKeyValue', () => {
  it('should return true for an object with string keys and string values', () => {
    const obj = { key1: 'value1', key2: 'value2' };
    expect(isObjectOfStringKeyValue(obj)).toBe(true);
  });

  it('should return false for an object with non-string values', () => {
    const obj = { key1: 1, key2: 'value2' };
    expect(isObjectOfStringKeyValue(obj)).toBe(false);
  });

  it('should return false for a non-object value', () => {
    expect(isObjectOfStringKeyValue(null)).toBe(false);
    expect(isObjectOfStringKeyValue(undefined)).toBe(false);
    expect(isObjectOfStringKeyValue(123)).toBe(false);
    expect(isObjectOfStringKeyValue('string')).toBe(false);
    expect(isObjectOfStringKeyValue([])).toBe(false);
  });

  it('should return true for an empty object', () => {
    expect(isObjectOfStringKeyValue({})).toBe(true);
  });

  it('should return false for an object with symbol keys', () => {
    const symbolKey = Symbol('key');
    const obj = { [symbolKey]: 'value1', key2: 'value2' };
    expect(isObjectOfStringKeyValue(obj)).toBe(false);
  });
});
