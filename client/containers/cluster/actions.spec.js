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

import actions from './actions';
import { CLUSTER_FETCH } from './action-types';
import {
  CLUSTER_FETCH_FAILED,
  CLUSTER_FETCH_START,
  CLUSTER_FETCH_SUCCESS,
} from './mutation-types';
import { canFetchCluster } from './helpers';
import { httpService } from '~services';

jest.mock('./helpers', () => ({
  canFetchCluster: jest.fn(),
}));

jest.mock('~services', () => ({
  httpService: {
    get: jest.fn(),
  },
}));

describe('cluster actions', () => {
  describe('CLUSTER_FETCH', () => {
    describe('canFetchCluster returns false', () => {
      beforeEach(() => {
        canFetchCluster.mockImplementation(() => false);
      });

      it('should not commit CLUSTER_FETCH_START', () => {
        const commit = jest.fn();
        const getters = {};

        actions[CLUSTER_FETCH]({ commit, getters });

        expect(commit).not.toHaveBeenCalled();
      });
    });

    describe('canFetchCluster returns true', () => {
      beforeEach(() => {
        canFetchCluster.mockImplementation(() => true);
      });

      it('should commit CLUSTER_FETCH_START', () => {
        const commit = jest.fn();
        const getters = {};

        actions[CLUSTER_FETCH]({ commit, getters });

        expect(commit).toHaveBeenCalledWith(CLUSTER_FETCH_START);
      });

      describe('when API throws an error', () => {
        beforeEach(() => {
          httpService.get.mockImplementation(() => {
            throw new Error();
          });
        });

        it('should commit CLUSTER_FETCH_FAILED', () => {
          const commit = jest.fn();
          const getters = {};

          actions[CLUSTER_FETCH]({ commit, getters });

          expect(commit).toHaveBeenCalledWith(
            CLUSTER_FETCH_FAILED,
            new Error()
          );
        });
      });

      describe('when API returns cluster', () => {
        const cluster = {
          persistenceInfo: {},
        };

        beforeEach(() => {
          httpService.get.mockImplementation(() => cluster);
        });

        it('should commit CLUSTER_FETCH_SUCCESS with cluster', async () => {
          const commit = jest.fn();
          const getters = {};

          await actions[CLUSTER_FETCH]({ commit, getters });

          expect(commit).toHaveBeenCalledWith(CLUSTER_FETCH_SUCCESS, cluster);
        });
      });
    });
  });
});
