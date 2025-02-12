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

import getterFns from './getters';
import {
  CLUSTER_ADVANCED_VISIBILITY_ENABLED,
  CLUSTER_FETCH_ERROR,
  CLUSTER_FETCH_EXPIRY_DATE_TIME,
  CLUSTER_VISIBILITY_FEATURES,
} from './getter-types';
import { initGetters } from '~test';

describe('cluster getters', () => {
  describe('CLUSTER_ADVANCED_VISIBILITY_ENABLED', () => {
    describe('state.cluster.data.persistenceInfo.visibilityStore.features is not set', () => {
      it('should return false.', () => {
        const state = {
          cluster: {},
        };

        const getters = initGetters({ getterFns, state });

        const output = getters[CLUSTER_ADVANCED_VISIBILITY_ENABLED];

        expect(output).toEqual(false);
      });
    });

    describe('state.cluster.data.persistenceInfo.visibilityStore.features is set', () => {
      it('should return advancedVisibilityEnabled enabled value.', () => {
        const state = {
          cluster: {
            data: {
              persistenceInfo: {
                visibilityStore: {
                  features: [
                    { enabled: true, key: 'advancedVisibilityEnabled' },
                  ],
                },
              },
            },
          },
        };

        const getters = initGetters({ getterFns, state });

        const output = getters[CLUSTER_ADVANCED_VISIBILITY_ENABLED];

        expect(output).toEqual(true);
      });
    });
  });

  describe('CLUSTER_FETCH_ERROR', () => {
    it('should return state.cluster.error.', () => {
      const state = {
        cluster: {
          error: 'an error message',
        },
      };

      const getters = initGetters({ getterFns, state });

      const output = getters[CLUSTER_FETCH_ERROR];

      expect(output).toEqual('an error message');
    });
  });

  describe('CLUSTER_FETCH_EXPIRY_DATE_TIME', () => {
    it('should return state.cluster.expiryDateTime', () => {
      const state = {
        cluster: {
          expiryDateTime: '2021-05-21T23:03:51.913Z',
        },
      };

      const getters = initGetters({ getterFns, state });

      const output = getters[CLUSTER_FETCH_EXPIRY_DATE_TIME];

      expect(output).toEqual('2021-05-21T23:03:51.913Z');
    });
  });

  describe('CLUSTER_VISIBILITY_FEATURES', () => {
    describe('state.cluster.data.persistenceInfo.visibilityStore.features is not set', () => {
      it('should return an empty array.', () => {
        const state = {
          cluster: {},
        };

        const getters = initGetters({ getterFns, state });

        const output = getters[CLUSTER_VISIBILITY_FEATURES];

        expect(output).toEqual([]);
      });
    });

    describe('state.cluster.data.persistenceInfo.visibilityStore.features is set', () => {
      it('should return state.cluster.data.persistenceInfo.visibilityStore.features.', () => {
        const state = {
          cluster: {
            data: {
              persistenceInfo: {
                visibilityStore: {
                  features: [
                    { enabled: true, key: 'advancedVisibilityEnabled' },
                  ],
                },
              },
            },
          },
        };

        const getters = initGetters({ getterFns, state });

        const output = getters[CLUSTER_VISIBILITY_FEATURES];

        expect(output).toEqual([
          { enabled: true, key: 'advancedVisibilityEnabled' },
        ]);
      });
    });
  });
});
