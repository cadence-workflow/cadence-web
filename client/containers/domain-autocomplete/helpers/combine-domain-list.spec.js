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

import combineDomainList from './combine-domain-list';

describe('combineDomainList', () => {
  describe('when passed domainList & visitedDomainList', () => {
    const visitedDomainList = [
      {
        domainInfo: {
          name: 'domain1',
        },
      },
      {
        domainInfo: {
          name: 'domain2',
          uuid: 2,
        },
      },
      {
        domainInfo: {
          name: 'domain3',
        },
      },
      {
        domainInfo: {
          name: 'domain4',
          uuid: 4,
        },
      },
    ];

    const domainList = [
      {
        domainInfo: {
          name: 'domain0',
          uuid: 0,
        },
      },
      {
        domainInfo: {
          name: 'domain1',
          uuid: 1,
        },
      },
      {
        domainInfo: {
          name: 'domain2',
          uuid: 2,
        },
      },
    ];

    it('should combine the two lists into a single list by removing any duplicates from the visitedDomainList.', () => {
      const output = combineDomainList({ domainList, visitedDomainList });

      expect(output).toEqual([
        {
          domainInfo: {
            name: 'domain0',
            uuid: 0,
          },
        },
        {
          domainInfo: {
            name: 'domain1',
            uuid: 1,
          },
        },
        {
          domainInfo: {
            name: 'domain2',
            uuid: 2,
          },
        },
        {
          domainInfo: {
            name: 'domain3',
          },
        },
        {
          domainInfo: {
            name: 'domain4',
            uuid: 4,
          },
        },
      ]);
    });
  });
});
