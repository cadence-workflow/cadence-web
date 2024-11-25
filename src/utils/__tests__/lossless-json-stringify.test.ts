import losslessJsonStringify from '../lossless-json-stringify';

describe('losslessJsonStringify', () => {
  it('should stringify a JSON object with safe numbers correctly', () => {
    const json = { number: 123 };
    const result = losslessJsonStringify(json);
    expect(result).toBe('{"number":123}');
  });

  it('should stringify BigInts as numbers', () => {
    const json = { bigNumber: BigInt('900719925474099223423423') };
    const result = losslessJsonStringify(json);
    expect(result).toBe('{"bigNumber":900719925474099223423423}');
  });

  it('should stringify integers correctly', () => {
    const json = { integer: 42 };
    const result = losslessJsonStringify(json);
    expect(result).toBe('{"integer":42}');
  });

  it('should stringify floating point numbers correctly', () => {
    const json = { float: 3.14 };
    const result = losslessJsonStringify(json);
    expect(result).toBe('{"float":3.14}');
  });

  it('should use the provided reviver function', () => {
    const json = { key: 'value' };
    const reviver = (key: string, value: any) => {
      if (key === 'key') {
        return 'newValue';
      }
      return value;
    };
    const result = losslessJsonStringify(json, reviver);
    expect(result).toBe('{"key":"newValue"}');
  });

  it('should handle null and undefined reviver correctly', () => {
    const json = { key: 'value' };
    const resultWithNullReviver = losslessJsonStringify(json, null);
    const resultWithUndefinedReviver = losslessJsonStringify(json, undefined);
    expect(resultWithNullReviver).toBe('{"key":"value"}');
    expect(resultWithUndefinedReviver).toBe('{"key":"value"}');
  });

  it('should format JSON with spaces correctly', () => {
    const json = { key: 'value' };
    const result = losslessJsonStringify(json, null, 2);
    expect(result).toBe('{\n  "key": "value"\n}');
  });

  it('should return an empty string for invalid JSON', () => {
    const json = () => {};
    const result = losslessJsonStringify(json);
    expect(result).toBe('');
  });

  it('should remove invalid JSON keys', () => {
    const json = { key: 'value', fn: () => {} };
    const result = losslessJsonStringify(json);
    expect(result).toBe('{"key":"value"}');
  });
});
