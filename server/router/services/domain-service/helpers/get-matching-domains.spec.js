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

import { DOMAIN_LIST_SEARCH_SIZE } from '../constants';
import getMatchingDomains from './get-matching-domains';

describe('getMatchingDomains', () => {
  const createDomains = ({ prefix = '', size }) => {
    const domainList = [];

    for (let i = 0; i < size; i++) {
      domainList.push({
        domainInfo: {
          name: prefix + i,
        },
      });
    }

    return domainList;
  };

  describe('when querystring = ""', () => {
    const querystring = '';

    it('should return the first domains of size = DOMAIN_LIST_SEARCH_SIZE.', () => {
      const domainList = createDomains({ size: DOMAIN_LIST_SEARCH_SIZE * 2 });
      const output = getMatchingDomains({ domainList, querystring });

      expect(output).toEqual(domainList.slice(0, DOMAIN_LIST_SEARCH_SIZE));
    });
  });

  describe('when querystring = "domain"', () => {
    const querystring = 'domain';

    it('should return the first domains matching "domain" of size = DOMAIN_LIST_SEARCH_SIZE.', () => {
      const notMatchedDomains = createDomains({
        prefix: 'not-matched',
        size: 2 * DOMAIN_LIST_SEARCH_SIZE,
      });
      const matchedDomains = createDomains({
        prefix: 'domain',
        size: 2 * DOMAIN_LIST_SEARCH_SIZE,
      });
      const domainList = [...notMatchedDomains, ...matchedDomains];
      const output = getMatchingDomains({ domainList, querystring });

      expect(output).toEqual(matchedDomains.slice(0, DOMAIN_LIST_SEARCH_SIZE));
    });
  });
});
