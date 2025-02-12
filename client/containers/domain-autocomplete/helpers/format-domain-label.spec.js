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

import formatDomainLabel from './format-domain-label';

describe('formatDomainLabel', () => {
  describe('when passed domain object with only name defined', () => {
    const domain = {
      domainInfo: {
        name: 'domainName',
      },
    };

    it('should render only the domainName.', () => {
      const output = formatDomainLabel(domain);

      expect(output).toEqual('domainName');
    });
  });

  describe('when passed a local domain object', () => {
    it('should return "domainName - Local - activeCluster"', () => {
      const domain = {
        domainInfo: {
          name: 'domainName',
        },
        isGlobalDomain: false,
        replicationConfiguration: {
          activeClusterName: 'activeCluster',
        },
      };

      const output = formatDomainLabel(domain);

      expect(output).toEqual('domainName - Local - activeCluster');
    });
  });

  describe('when passed a global domain object', () => {
    it('should return "domainName - Global - activeCluster"', () => {
      const domain = {
        domainInfo: {
          name: 'domainName',
        },
        isGlobalDomain: true,
        replicationConfiguration: {
          activeClusterName: 'activeCluster',
        },
      };

      const output = formatDomainLabel(domain);

      expect(output).toEqual('domainName - Global - activeCluster');
    });
  });
});
