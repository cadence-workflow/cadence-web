import losslessJsonParse from '../lossless-json-parse';

describe('losslessJsonParse', () => {
  it('should parse large numbers as BigInt', () => {
    const json = '{"bigNumber": 90071992547409923213}';
    const result = losslessJsonParse(json);
    expect(result).toEqual({ bigNumber: BigInt('90071992547409923213') });
  });

  it('should parse strings of large numbers as string', () => {
    const json = '{"bigNumber": "90071992547409923213"}';
    const result = losslessJsonParse(json);
    expect(result).toEqual({ bigNumber: '90071992547409923213' });
  });

  it('should parse a JSON string with integers correctly', () => {
    const json = '{"integer": 42}';
    const result = losslessJsonParse(json);
    expect(result).toEqual({ integer: 42 });
  });

  it('should parse floating point numbers correctly', () => {
    const json = '{"float": 3.14}';
    const result = losslessJsonParse(json);
    expect(result).toEqual({ float: 3.14 });
  });

  it('should use the provided reviver function', () => {
    const json = '{"key": "value"}';
    const reviver = (key: string, value: any) => {
      if (key === 'key') {
        return 'newValue';
      }
      return value;
    };
    const result = losslessJsonParse(json, reviver);
    expect(result).toEqual({ key: 'newValue' });
  });

  it('should handle null and undefined reviver correctly', () => {
    const json = '{"key": "value"}';
    const resultWithNullReviver = losslessJsonParse(json, null);
    const resultWithUndefinedReviver = losslessJsonParse(json, undefined);
    expect(resultWithNullReviver).toEqual({ key: 'value' });
    expect(resultWithUndefinedReviver).toEqual({ key: 'value' });
  });

  it('should throw an error if the JSON is invalid', () => {
    const json = '{"key": "value"';
    expect(() => losslessJsonParse(json)).toThrow();
  });
});
