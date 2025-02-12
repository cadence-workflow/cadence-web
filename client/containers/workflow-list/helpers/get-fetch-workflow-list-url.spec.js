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

import {
  FILTER_MODE_ADVANCED,
  FILTER_MODE_BASIC,
  STATE_CLOSED,
  STATE_OPEN,
} from '../constants';
import getFetchWorkflowListUrl from './get-fetch-workflow-list-url';

describe('getFetchWorkflowListUrl', () => {
  describe('domain = "samples-domain"', () => {
    const domain = 'samples-domain';

    describe('filterMode = FILTER_MODE_ADVANCED', () => {
      const filterMode = FILTER_MODE_ADVANCED;

      it('should return "/api/domains/samples-domain/workflows/list"', () => {
        const output = getFetchWorkflowListUrl({ domain, filterMode });

        expect(output).toEqual('/api/domains/samples-domain/workflows/list');
      });
    });

    describe('filterMode = FILTER_MODE_BASIC', () => {
      const filterMode = FILTER_MODE_BASIC;

      describe('state = STATE_CLOSED', () => {
        const state = STATE_CLOSED;

        it('should return "/api/domains/samples-domain/workflows/closed"', () => {
          const output = getFetchWorkflowListUrl({ domain, filterMode, state });

          expect(output).toEqual(
            '/api/domains/samples-domain/workflows/closed'
          );
        });
      });

      describe('state = STATE_OPEN', () => {
        const state = STATE_OPEN;

        it('should return "/api/domains/samples-domain/workflows/open"', () => {
          const output = getFetchWorkflowListUrl({ domain, filterMode, state });

          expect(output).toEqual('/api/domains/samples-domain/workflows/open');
        });
      });
    });
  });
});
