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

import { delay } from '../../../helpers';
import fetchDomainListNextPage from './fetch-domain-list-next-page';

jest.mock('../../../helpers', () => ({
  delay: jest.fn(),
}));

describe('fetchDomainListNextPage', () => {
  const getMockContext = domainResponse => {
    const ctx = {
      cadence: {
        listDomains: jest.fn().mockImplementation(() => domainResponse),
      },
    };

    return ctx;
  };

  describe('when no nextPageToken returned', () => {
    it('should return domainList.', async () => {
      const domains = ['domain1', 'domain2'];
      const domainResponse = {
        domains,
        nextPageToken: null,
      };

      const ctx = getMockContext(domainResponse);

      const domainList = await fetchDomainListNextPage({
        ctx,
      });

      expect(domainList).toEqual(domains);
    });
  });

  describe('when nextPageToken is returned', () => {
    it('should call delay and should call itself again to get next domain list page.', async () => {
      const nextPageToken = '1234';
      const domains1 = ['domain1', 'domain2'];
      const domains2 = ['domain3', 'domain4'];
      const domainResponse = {
        domains: domains1,
        nextPageToken,
      };

      const ctx = getMockContext(domainResponse);

      delay.mockImplementation(() => {
        domainResponse.domains = domains2;
        domainResponse.nextPageToken = null;
      });

      const domainList = await fetchDomainListNextPage({
        ctx,
      });

      expect(domainList).toEqual([...domains1, ...domains2]);
    });
  });
});
