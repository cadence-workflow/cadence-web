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

import getUpdatedQuery from './get-updated-query';

describe('route helpers getUpdatedQuery', () => {
  describe('when getUpdatedQuery is called with a param in payload that is an empty string', () => {
    const query = {
      omittedQuery: 'previous-query-value',
    };

    const payload = {
      omittedQuery: '',
    };

    it('should omit that entry from the returned updated query.', () => {
      const output = getUpdatedQuery({ payload, query });

      expect(output.omittedQuery).toEqual(undefined);
    });
  });

  describe('when getUpdatedQuery is called with a payload which does not change the query', () => {
    const query = {
      key: 'value',
      key2: 'value2',
    };

    const payload = {
      key: 'value',
    };

    it('should return null.', () => {
      const output = getUpdatedQuery({ payload, query });

      expect(output).toEqual(null);
    });
  });
});
