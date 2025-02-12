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
  STATE_ALL,
  STATE_CLOSED,
  STATE_OPEN,
  STATUS_ALL,
  STATUS_CLOSED,
  STATUS_COMPLETED,
  STATUS_OPEN,
} from '../constants';
import getState from './get-state';

describe('getState', () => {
  describe('when statusName = ""', () => {
    const statusName = '';

    it('should return STATE_ALL.', () => {
      const output = getState(statusName);

      expect(output).toEqual(STATE_ALL);
    });
  });

  describe('when statusName = STATUS_ALL', () => {
    const statusName = STATUS_ALL;

    it('should return STATE_ALL.', () => {
      const output = getState(statusName);

      expect(output).toEqual(STATE_ALL);
    });
  });

  describe('when statusName = STATUS_OPEN', () => {
    const statusName = STATUS_OPEN;

    it('should return STATE_OPEN.', () => {
      const output = getState(statusName);

      expect(output).toEqual(STATE_OPEN);
    });
  });

  describe('when statusName = STATUS_CLOSED', () => {
    const statusName = STATUS_CLOSED;

    it('should return STATE_CLOSED.', () => {
      const output = getState(statusName);

      expect(output).toEqual(STATE_CLOSED);
    });
  });

  describe('when statusName = STATUS_COMPLETED', () => {
    const statusName = STATUS_COMPLETED;

    it('should return STATE_CLOSED.', () => {
      const output = getState(statusName);

      expect(output).toEqual(STATE_CLOSED);
    });
  });
});
