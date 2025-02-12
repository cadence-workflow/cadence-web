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

import formatInputPayload from './format-input-payload';

describe('formatInputPayload', () => {
  // empty data checks
  it('should return null if payload is null', () => {
    const input = null;
    const expected = null;

    expect(formatInputPayload(input)).toEqual(expected);
  });

  it('should return null if payload is undefined', () => {
    const input = undefined;
    const expected = null;

    expect(formatInputPayload(input)).toEqual(expected);
  });

  it('should return null if data is missing', () => {
    const input = {};
    const expected = null;

    expect(formatInputPayload(input)).toEqual(expected);
  });

  it('should return null if data is null', () => {
    const input = { data: null };
    const expected = null;

    expect(formatInputPayload(input)).toEqual(expected);
  });

  it('should return null if data is an empty string', () => {
    const input = { data: '' };
    const expected = null;

    expect(formatInputPayload(input)).toEqual(expected);
  });
  // end of empty data checks

  it('should parse base64 encoded JSON lines correctly', () => {
    const input = {
      data: btoa(`{"name": "John", "age": 30}\n{"name": "Jane", "age": 25}`),
    };
    const expected = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];

    expect(formatInputPayload(input)).toEqual(expected);
  });
});
