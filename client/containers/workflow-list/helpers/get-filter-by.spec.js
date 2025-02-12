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

import {
  FILTER_BY_CLOSE_TIME,
  FILTER_BY_START_TIME,
  STATUS_ALL,
  STATUS_CLOSED,
  STATUS_OPEN,
} from '../constants';
import getFilterBy from './get-filter-by';

describe('getFilterBy', () => {
  describe('statusName = STATUS_ALL', () => {
    const statusName = STATUS_ALL;

    it('should return FILTER_BY_START_TIME.', () => {
      const output = getFilterBy(statusName);

      expect(output).toEqual(FILTER_BY_START_TIME);
    });
  });

  describe('statusName = STATUS_OPEN', () => {
    const statusName = STATUS_OPEN;

    it('should return FILTER_BY_START_TIME.', () => {
      const output = getFilterBy(statusName);

      expect(output).toEqual(FILTER_BY_START_TIME);
    });
  });

  describe('statusName = STATUS_CLOSED', () => {
    const statusName = STATUS_CLOSED;

    it('should return FILTER_BY_CLOSE_TIME.', () => {
      const output = getFilterBy(statusName);

      expect(output).toEqual(FILTER_BY_CLOSE_TIME);
    });
  });
});
