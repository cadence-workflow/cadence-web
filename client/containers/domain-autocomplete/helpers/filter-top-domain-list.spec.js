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

import { TOP_DOMAIN_LIST_LIMIT } from '../constants';
import filterTopDomainList from './filter-top-domain-list';

describe('filterTopDomainList', () => {
  const createDomainList = size => {
    const newDomainList = [];

    for (let i = 1; i < size + 1; i++) {
      newDomainList.push(`domain${i}`);
    }

    return newDomainList;
  };

  describe('when domainList is greater than TOP_DOMAIN_LIST_LIMIT', () => {
    let domainList;

    beforeEach(() => {
      domainList = createDomainList(TOP_DOMAIN_LIST_LIMIT * 2);
    });

    it('should return only the first domains of size = TOP_DOMAIN_LIST_LIMIT', () => {
      const output = filterTopDomainList(domainList);

      expect(output.length).toEqual(TOP_DOMAIN_LIST_LIMIT);
      expect(output[0]).toEqual('domain1');
      expect(output[output.length - 1]).toEqual(
        `domain${TOP_DOMAIN_LIST_LIMIT}`
      );
    });
  });
});
