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

import MockDate from 'mockdate';
import hasExpired from './has-expired';

describe('hasExpired', () => {
  beforeEach(() => {
    MockDate.set(new Date('2020-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('when expiryDateTime is not passed', () => {
    it('should return true.', () => {
      const output = hasExpired();

      expect(output).toEqual(true);
    });
  });

  describe('when expiryDateTime is in the past', () => {
    it('should return true.', () => {
      const output = hasExpired(new Date('2019-12-30T00:00:00.000Z'));

      expect(output).toEqual(true);
    });
  });

  describe('when expiryDateTime is in the future', () => {
    it('should return false.', () => {
      const output = hasExpired(new Date('2020-01-01T01:00:00.000Z'));

      expect(output).toEqual(false);
    });
  });
});
