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

import { CLUSTER_FETCH } from './action-types';
import { CLUSTER_FETCH_EXPIRY_DATE_TIME } from './getter-types';
import { canFetchCluster } from './helpers';
import {
  CLUSTER_FETCH_FAILED,
  CLUSTER_FETCH_START,
  CLUSTER_FETCH_SUCCESS,
} from './mutation-types';
import { httpService } from '~services';

const actions = {
  [CLUSTER_FETCH]: async ({ commit, getters }) => {
    if (!canFetchCluster(getters[CLUSTER_FETCH_EXPIRY_DATE_TIME])) {
      return;
    }

    commit(CLUSTER_FETCH_START);

    try {
      const cluster = await httpService.get('/api/cluster');

      commit(CLUSTER_FETCH_SUCCESS, cluster);
    } catch (error) {
      commit(CLUSTER_FETCH_FAILED, error);
    }
  },
};

export default actions;
