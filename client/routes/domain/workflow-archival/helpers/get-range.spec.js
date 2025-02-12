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

import moment from 'moment';
import getRange from './get-range';

describe('getRange', () => {
  describe('When nothing is passed', () => {
    it('should return "last-24-hours".', () => {
      const output = getRange();

      expect(output).toEqual('last-24-hours');
    });
  });

  describe('When range = "last-10-days"', () => {
    it('should return "last-10-days".', () => {
      const range = 'last-10-days';
      const output = getRange({ range });

      expect(output).toEqual('last-10-days');
    });
  });

  describe('When startTime = "2020-03-01T00:00:00Z" and endTime = "2020-03-30T00:00:00Z"', () => {
    let startTime;
    let endTime;

    beforeEach(() => {
      startTime = '2020-03-01T00:00:00Z';
      endTime = '2020-03-30T00:00:00Z';
    });

    it('should return startTime = moment("2020-03-01T00:00:00Z").', () => {
      const output = getRange({ endTime, startTime });

      expect(output.startTime).toEqual(moment('2020-03-01T00:00:00Z'));
    });

    it('should return endTime = moment("2020-03-30T00:00:00Z").', () => {
      const output = getRange({ endTime, startTime });

      expect(output.endTime).toEqual(moment('2020-03-30T00:00:00Z'));
    });
  });
});
