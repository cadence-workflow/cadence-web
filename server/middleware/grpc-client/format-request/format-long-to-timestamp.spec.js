// Copyright (c) 2022-2025 Uber Technologies Inc.
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

const Long = require('long');
const formatLongToTimestamp = require('./format-long-to-timestamp');

describe('formatLongToTimestamp', () => {
  it('converts a long to a timestamp', () => {
    const expectedTimestamp = {
      seconds: 1655151848,
      nanos: 301000000,
    };
    const dateString = '2022-06-13T20:24:08.301Z';
    const date = new Date(dateString);
    const dateLong = Long.fromValue(Number(date)).mul(1e6);
    const dateTimestamp = formatLongToTimestamp(dateLong);

    expect(dateTimestamp).toEqual(expectedTimestamp);

    // convert back to date string to verify
    const parsedDateMillis =
      dateTimestamp.seconds * 1e3 + Math.floor(dateTimestamp.nanos / 1e6);
    const parsedDate = new Date(parsedDateMillis);

    expect(parsedDate.toISOString()).toEqual(dateString);
  });
});
