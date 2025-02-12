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

import isHistoryArchivalEnabled from './is-history-archival-enabled';

describe('isHistoryArchivalEnabled', () => {
  describe('When domainSettings is not defined', () => {
    it('should return false.', () => {
      const domainSettings = undefined;
      const output = isHistoryArchivalEnabled(domainSettings);

      expect(output).toEqual(false);
    });
  });

  describe('When domainSettings.configuration.historyArchivalStatus = "DISABLED"', () => {
    it('should return false.', () => {
      const domainSettings = {
        configuration: {
          historyArchivalStatus: 'DISABLED',
        },
      };
      const output = isHistoryArchivalEnabled(domainSettings);

      expect(output).toEqual(false);
    });
  });

  describe('When domainSettings.configuration.historyArchivalStatus = "ENABLED"', () => {
    it('should return true.', () => {
      const domainSettings = {
        configuration: {
          historyArchivalStatus: 'ENABLED',
        },
      };
      const output = isHistoryArchivalEnabled(domainSettings);

      expect(output).toEqual(true);
    });
  });
});
