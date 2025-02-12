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

import getStringElipsis from './get-string-elipsis';
import { MAXIMUM_JSON_CHARACTER_LIMIT, MAXIMUM_JSON_MESSAGE } from '~constants';

describe('getStringElipsis', () => {
  describe('when passed a string that has a length less than MAXIMUM_JSON_CHARACTER_LIMIT', () => {
    it('should return the original string', () => {
      const input = 'a-short-string';
      const output = getStringElipsis(input);

      expect(output).toEqual('a-short-string');
    });
  });
  describe('when passed the empty string', () => {
    it('should return the empty string', () => {
      const input = '';
      const output = getStringElipsis(input);

      expect(output).toEqual('');
    });
  });
  describe('when passed a string that has a length equal to MAXIMUM_JSON_CHARACTER_LIMIT', () => {
    it('should return a substring of the original string up until the limit and display a message.', () => {
      const input = ''.padEnd(MAXIMUM_JSON_CHARACTER_LIMIT, '_');
      const output = getStringElipsis(input);

      expect(output).toEqual(input + MAXIMUM_JSON_MESSAGE);
    });
  });
});
