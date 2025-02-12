// Copyright (c) 2017-2025 Uber Technologies Inc.
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

import parseStringToBoolean from './parse-string-to-boolean';

describe('parseStringToBoolean', () => {
  it('should return true when passed value = "true".', () => {
    const output = parseStringToBoolean('true');

    expect(output).toEqual(true);
  });

  it('should return false when passed value = "false".', () => {
    const output = parseStringToBoolean('false');

    expect(output).toEqual(false);
  });

  it('should return false when nothing is passed.', () => {
    const output = parseStringToBoolean();

    expect(output).toEqual(false);
  });

  it('should return true when passed value = null and defaultValue = true.', () => {
    const output = parseStringToBoolean(null, true);

    expect(output).toEqual(true);
  });
});
