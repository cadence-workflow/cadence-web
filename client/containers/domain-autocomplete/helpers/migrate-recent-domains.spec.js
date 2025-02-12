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

import migrateRecentDomains from './migrate-recent-domains';

describe('migrateRecentDomains', () => {
  describe('when passed domainList array of strings', () => {
    it('should format to array objects.', () => {
      const domainList = ['domainA', 'domainB', 'domainC'];
      const output = migrateRecentDomains(domainList);

      expect(output).toEqual([
        {
          domainInfo: {
            name: 'domainA',
          },
        },
        {
          domainInfo: {
            name: 'domainB',
          },
        },
        {
          domainInfo: {
            name: 'domainC',
          },
        },
      ]);
    });
  });

  describe('when passed domainList array of objects', () => {
    it('should not change the array.', () => {
      const domainList = [
        {
          domainInfo: {
            name: 'domainA',
            uuid: 1,
          },
        },
        {
          domainInfo: {
            name: 'domainB',
            uuid: 2,
          },
        },
        {
          domainInfo: {
            name: 'domainC',
            uuid: 2,
          },
        },
      ];
      const output = migrateRecentDomains(domainList);

      expect(output).toEqual([
        {
          domainInfo: {
            name: 'domainA',
            uuid: 1,
          },
        },
        {
          domainInfo: {
            name: 'domainB',
            uuid: 2,
          },
        },
        {
          domainInfo: {
            name: 'domainC',
            uuid: 2,
          },
        },
      ]);
    });
  });

  describe('when passed domainList array of mixed strings and objects', () => {
    it('should only change the strings to objects and leave the rest.', () => {
      const domainList = [
        {
          domainInfo: {
            name: 'domainA',
            uuid: 1,
          },
        },
        {
          domainInfo: {
            name: 'domainB',
            uuid: 2,
          },
        },
        'domainC',
      ];
      const output = migrateRecentDomains(domainList);

      expect(output).toEqual([
        {
          domainInfo: {
            name: 'domainA',
            uuid: 1,
          },
        },
        {
          domainInfo: {
            name: 'domainB',
            uuid: 2,
          },
        },
        {
          domainInfo: {
            name: 'domainC',
          },
        },
      ]);
    });
  });
});
