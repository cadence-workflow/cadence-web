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

import { VISITED_DOMAIN_LIST_LIMIT } from '../constants';
import updateVisitedDomainList from './update-visited-domain-list';

describe('updateVisitedDomainList', () => {
  const getVisitedDomainList = () => [
    {
      domainInfo: {
        name: 'domainString',
      },
    },
    {
      domainInfo: {
        uuid: 2,
        name: 'domainObject',
      },
    },
  ];

  const getVisitedDomainListOfSize = size => {
    const visitedDomainList = [];

    for (let i = 1; i < size + 1; i++) {
      visitedDomainList.push({
        domainInfo: {
          uuid: i,
          name: `domain${i}`,
        },
      });
    }

    return visitedDomainList;
  };

  describe('when value does not exist in visitedDomainList', () => {
    describe('and the visited domain list does not equal the limit', () => {
      it('should add the value to the end of the visitedDomainList.', () => {
        const value = {
          domainInfo: {
            uuid: 3,
            name: 'domain3',
          },
        };
        const visitedDomainList = getVisitedDomainListOfSize(2);
        const output = updateVisitedDomainList({ value, visitedDomainList });

        expect(output).toEqual([
          {
            domainInfo: {
              uuid: 1,
              name: 'domain1',
            },
          },
          {
            domainInfo: {
              uuid: 2,
              name: 'domain2',
            },
          },
          {
            domainInfo: {
              uuid: 3,
              name: 'domain3',
            },
          },
        ]);
      });
    });

    describe('and the visited domain list equals the limit', () => {
      it('should remove the first item and add the value to the end of the visitedDomainList.', () => {
        const value = {
          domainInfo: {
            uuid: VISITED_DOMAIN_LIST_LIMIT + 1,
            name: `domain${VISITED_DOMAIN_LIST_LIMIT + 1}`,
          },
        };
        const visitedDomainList = getVisitedDomainListOfSize(
          VISITED_DOMAIN_LIST_LIMIT
        );

        const output = updateVisitedDomainList({ value, visitedDomainList });

        expect(output).toEqual([
          ...getVisitedDomainListOfSize(VISITED_DOMAIN_LIST_LIMIT).slice(1),
          value,
        ]);
      });
    });

    describe('and the visited domain list exceeds the limit', () => {
      it('should remove the first three items and add the value to the end of the visitedDomainList.', () => {
        const value = {
          domainInfo: {
            uuid: VISITED_DOMAIN_LIST_LIMIT + 3,
            name: `domain${VISITED_DOMAIN_LIST_LIMIT + 3}`,
          },
        };
        const visitedDomainList = getVisitedDomainListOfSize(
          VISITED_DOMAIN_LIST_LIMIT + 2
        );

        const output = updateVisitedDomainList({ value, visitedDomainList });

        expect(output).toEqual([
          ...getVisitedDomainListOfSize(VISITED_DOMAIN_LIST_LIMIT + 2).slice(3),
          value,
        ]);
      });
    });
  });

  describe('when value does exist in visitedDomainList', () => {
    it('should update the matchedDomain in visitedDomainList with the value object and place it at the end of the visitedDomainList.', () => {
      const value = {
        domainInfo: {
          uuid: 1,
          name: 'domainString',
        },
      };
      const visitedDomainList = getVisitedDomainList();
      const output = updateVisitedDomainList({ value, visitedDomainList });

      expect(output).toEqual([
        {
          domainInfo: {
            uuid: 2,
            name: 'domainObject',
          },
        },
        {
          domainInfo: {
            uuid: 1,
            name: 'domainString',
          },
        },
      ]);
    });
  });
});
