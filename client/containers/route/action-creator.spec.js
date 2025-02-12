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

import actionCreator from './action-creator';
import { ROUTE_PUSH, ROUTE_REPLACE, ROUTE_UPDATE_QUERY } from './action-types';
import { ROUTE_QUERY } from './getter-types';

const getRouterMock = () => ({
  push: jest.fn(),
  replace: jest.fn(),
});

describe('route action creator', () => {
  describe('when calling actions[ROUTE_PUSH] with "/test"', () => {
    it('should call router.push with "/test".', () => {
      const router = getRouterMock();
      const actions = actionCreator(router);

      actions[ROUTE_PUSH](null, '/test');
      expect(router.push).toHaveBeenCalledWith('/test');
    });
  });

  describe('when calling actions[ROUTE_REPLACE] with "/test"', () => {
    it('should call router.replace with "/test".', () => {
      const router = getRouterMock();
      const actions = actionCreator(router);

      actions[ROUTE_REPLACE](null, '/test');
      expect(router.replace).toHaveBeenCalledWith('/test');
    });
  });

  describe('when calling actions[ROUTE_UPDATE_QUERY] with a getter and test object', () => {
    it('should call router.replace with the original getter query with the test object override.', () => {
      const router = getRouterMock();
      const getters = {
        [ROUTE_QUERY]: {
          otherQuery: 'otherValue',
          test: 'valueA',
        },
      };
      const actions = actionCreator(router);

      actions[ROUTE_UPDATE_QUERY]({ getters }, { test: 'valueB' });
      expect(router.replace).toHaveBeenCalledWith({
        query: {
          otherQuery: 'otherValue',
          test: 'valueB',
        },
      });
    });
  });
});
