// Copyright (c) 2024-2025 Uber Technologies Inc.
//
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import parseJsonLines from './parse-json-lines';

describe('parseJsonLines', () => {
  // empty data checks
  it('should return null if input is null', () => {
    const input = null;
    const expected = null;

    expect(parseJsonLines(input)).toEqual(expected);
  });

  it('should return null if input is undefined', () => {
    const input = undefined;
    const expected = null;

    expect(parseJsonLines(input)).toEqual(expected);
  });

  it('should return null if input is an empty string', () => {
    const input = '';
    const expected = null;

    expect(parseJsonLines(input)).toEqual(expected);
  });
  // end of empty data checks

  it('should parse base64 encoded JSON lines correctly', () => {
    const input = `{"name": "John", "age": 30}\n{"name": "Jane", "age": 25}`;
    const expected = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];

    expect(parseJsonLines(input)).toEqual(expected);
  });

  it('should handle base64 encoded JSON with \\n within string values', () => {
    const input = `{"name": "John\\nDoe", "age": 30}\n{"name": "Alice", "city": "Wonderland"}`;
    const expected = [
      { name: 'John\nDoe', age: 30 },
      { name: 'Alice', city: 'Wonderland' },
    ];

    expect(parseJsonLines(input)).toEqual(expected);
  });

  it('should handle base64 encoded malformed JSON gracefully', () => {
    const input = `{"name": "John", "age": 30}\n{malformed JSON}`;
    const expected = [{ name: 'John', age: 30 }];

    expect(parseJsonLines(input)).toEqual(expected);
  });
  it('should handle base64 encoded mix of numbers, strings, arrays, nulls', () => {
    const input = `42\n"Hello, World!"\n[1, 2, 3]\nnull`;
    const expected = [42, 'Hello, World!', [1, 2, 3], null];

    expect(parseJsonLines(input)).toEqual(expected);
  });

  it('should handle base64 encoded JSON objects with mixed types', () => {
    const input = `{"number": 123, "string": "test", "array": [1, "two", 3], "nullValue": null}`;
    const expected = [
      { number: 123, string: 'test', array: [1, 'two', 3], nullValue: null },
    ];

    expect(parseJsonLines(input)).toEqual(expected);
  });

  it('should handle base64 encoded multiple mixed JSON objects', () => {
    const input = `{"a": 1, "b": "text"}\n{"c": [1, 2, 3], "d": null}\n42\n"Hello"`;
    const expected = [
      { a: 1, b: 'text' },
      { c: [1, 2, 3], d: null },
      42,
      'Hello',
    ];

    expect(parseJsonLines(input)).toEqual(expected);
  });
});
