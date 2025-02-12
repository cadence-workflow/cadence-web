// Copyright (c) 2021-2025 Uber Technologies Inc.
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

import { STATUS_ALL, STATUS_CLOSED, STATUS_OPEN } from '../constants';
import getMinStartDate from './get-min-start-date';

describe('getMinStartDate', () => {
  describe('when statusName = STATUS_OPEN', () => {
    const statusName = STATUS_OPEN;

    it('should return null.', () => {
      const output = getMinStartDate({ statusName });

      expect(output).toEqual(null);
    });
  });

  describe('when statusName = STATUS_ALL', () => {
    const statusName = STATUS_ALL;

    it('should return null.', () => {
      const output = getMinStartDate({ statusName });

      expect(output).toEqual(null);
    });
  });

  describe('when statusName = STATUS_CLOSED and maxRetentionDays = 3', () => {
    const maxRetentionDays = 3;
    const statusName = STATUS_CLOSED;

    it('should return a date 3 days before now.', () => {
      const now = new Date(2021, 4, 4); // month is 0 based. 4 = may
      const output = getMinStartDate({ maxRetentionDays, now, statusName });

      expect(output.toISOString()).toEqual('2021-05-01T00:00:00.000Z');
    });
  });
});
