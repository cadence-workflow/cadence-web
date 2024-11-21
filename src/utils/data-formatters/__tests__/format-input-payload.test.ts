import formatInputPayload from '../format-input-payload';

describe('formatInputPayload', () => {
  // empty data checks
  test('should return null if payload is null', () => {
    const input = null;
    const expected = null;
    expect(formatInputPayload(input)).toEqual(expected);
  });

  test('should return null if payload is undefined', () => {
    const input = undefined;
    const expected = null;
    expect(formatInputPayload(input)).toEqual(expected);
  });

  test('should return null if data is missing', () => {
    const input = {};
    const expected = null;
    expect(formatInputPayload(input)).toEqual(expected);
  });

  test('should return null if data is null', () => {
    const input = { data: null };
    const expected = null;
    expect(formatInputPayload(input)).toEqual(expected);
  });

  test('should return null if data is an empty string', () => {
    const input = { data: '' };
    const expected = null;
    expect(formatInputPayload(input)).toEqual(expected);
  });
  // end of empty data checks

  test('should parse base64 encoded JSON lines correctly', () => {
    const input = {
      data: btoa(`{"name": "John", "age": 30}\n{"name": "Jane", "age": 25}`),
    };
    const expected = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];
    expect(formatInputPayload(input)).toEqual(expected);
  });

  test('should handle base64 encoded JSON with \\n within string values', () => {
    const input = {
      data: btoa(
        `{"name": "John\\nDoe", "age": 30}\n{"name": "Alice", "city": "Wonderland"}`
      ),
    };
    const expected = [
      { name: 'John\nDoe', age: 30 },
      { name: 'Alice', city: 'Wonderland' },
    ];
    expect(formatInputPayload(input)).toEqual(expected);
  });

  test('should handle base64 encoded malformed JSON gracefully', () => {
    const input = {
      data: btoa(`{"name": "John", "age": 30}\n{malformed JSON}`),
    };
    const expected = [{ name: 'John', age: 30 }];
    expect(formatInputPayload(input)).toEqual(expected);
  });
  test('should handle base64 encoded mix of numbers, strings, arrays, nulls', () => {
    const input = { data: btoa(`42\n"Hello, World!"\n[1, 2, 3]\nnull`) };
    const expected = [42, 'Hello, World!', [1, 2, 3], null];
    expect(formatInputPayload(input)).toEqual(expected);
  });

  test('should handle base64 encoded JSON objects with mixed types', () => {
    const input = {
      data: btoa(
        `{"number": 123, "string": "test", "array": [1, "two", 3], "nullValue": null}`
      ),
    };
    const expected = [
      { number: 123, string: 'test', array: [1, 'two', 3], nullValue: null },
    ];
    expect(formatInputPayload(input)).toEqual(expected);
  });

  test('should handle base64 encoded multiple mixed JSON objects', () => {
    const input = {
      data: btoa(
        `{"a": 1, "b": "text"}\n{"c": [1, 2, 3], "d": null}\n42\n"Hello"`
      ),
    };
    const expected = [
      { a: 1, b: 'text' },
      { c: [1, 2, 3], d: null },
      42,
      'Hello',
    ];
    expect(formatInputPayload(input)).toEqual(expected);
  });
});
