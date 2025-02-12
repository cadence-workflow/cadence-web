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

import moment from 'moment';
import {
  CLUSTER_FETCH_FAILED,
  CLUSTER_FETCH_START,
  CLUSTER_FETCH_SUCCESS,
} from './mutation-types';
import { CLUSTER_FETCH_EXPIRY_TTL } from './constants';

const mutations = {
  [CLUSTER_FETCH_FAILED]: (state, payload) => {
    state.cluster.error = payload;
  },
  [CLUSTER_FETCH_START]: state => {
    state.cluster.error = null;
  },
  [CLUSTER_FETCH_SUCCESS]: (state, payload) => {
    state.cluster.expiryDateTime = moment()
      .add(CLUSTER_FETCH_EXPIRY_TTL)
      .toISOString();
    state.cluster.data = payload;
  },
};

export default mutations;
