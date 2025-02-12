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

import mutations from './mutations';
import {
  CLUSTER_FETCH_FAILED,
  CLUSTER_FETCH_START,
  CLUSTER_FETCH_SUCCESS,
} from './mutation-types';

jest.mock('moment', () => () =>
  jest.requireActual('moment')('2020-01-01T00:00:00.000Z')
);

describe('cluster mutations', () => {
  describe('CLUSTER_FETCH_FAILED', () => {
    const state = {
      cluster: {
        error: null,
      },
    };

    it('should set state.cluster.error = payload.', () => {
      const payload = 'an error message';

      mutations[CLUSTER_FETCH_FAILED](state, payload);
      expect(state.cluster.error).toEqual('an error message');
    });
  });

  describe('CLUSTER_FETCH_START', () => {
    const state = {
      cluster: {
        error: 'an error message',
      },
    };

    it('should set state.cluster.error = null.', () => {
      mutations[CLUSTER_FETCH_START](state);
      expect(state.cluster.error).toEqual(null);
    });
  });

  describe('CLUSTER_FETCH_SUCCESS', () => {
    const state = {
      cluster: {
        data: null,
        expiryDateTime: null,
      },
    };

    it('should set state.cluster.data = payload and state.cluster.expiryDateTime = Date() + CLUSTER_FETCH_EXPIRY_TTL', () => {
      const payload = {};

      mutations[CLUSTER_FETCH_SUCCESS](state, payload);
      expect(state.cluster).toEqual({
        data: {},
        expiryDateTime: '2020-01-01T01:00:00.000Z',
      });
    });
  });
});
