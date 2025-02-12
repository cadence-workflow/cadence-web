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
import getTimeStampDisplay from './get-time-stamp-display';

describe('getTimeStampDisplay', () => {
  const DATE = '2020-01-01 00:00:00';

  describe('When passed an event with no timestamp', () => {
    it('should return "".', () => {
      const event = {};
      const output = getTimeStampDisplay({ event });

      expect(output).toEqual('');
    });
  });

  describe('When passed an event with a timestamp and index = -1', () => {
    it('should return "".', () => {
      const event = {
        timestamp: moment(DATE),
      };
      const index = -1;
      const output = getTimeStampDisplay({ event, index });

      expect(output).toEqual('');
    });
  });

  describe('When passed an event with a timestamp and index = 0', () => {
    it('should return the date string.', () => {
      const event = {
        timestamp: moment(DATE),
      };
      const index = 0;
      const output = getTimeStampDisplay({ event, index });

      expect(output).toEqual('Jan 1, 2020 12:00:00 AM');
    });
  });
});
