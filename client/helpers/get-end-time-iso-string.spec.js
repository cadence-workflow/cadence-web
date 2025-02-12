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

import getEndTimeIsoString from './get-end-time-iso-string';

describe('getEndTimeIsoString', () => {
  describe('When range = undefined', () => {
    it('should return endTimeString.', () => {
      const range = undefined;
      const endTimeString = '2020-03-30T00:00:00Z';
      const output = getEndTimeIsoString(range, endTimeString);

      expect(output).toEqual(endTimeString);
    });
  });

  describe('When moment is set to March 1st 2020 and range = "last-30-days"', () => {
    it('should return "2020-03-01T23:59:59.999Z".', () => {
      jest
        .spyOn(Date, 'now')
        .mockImplementation(() => new Date(Date.UTC(2020, 2, 1)).getTime());
      const range = 'last-30-days';
      const endTimeString = '';
      const output = getEndTimeIsoString(range, endTimeString);

      expect(output).toEqual('2020-03-01T23:59:59.999Z');
    });
  });
});
