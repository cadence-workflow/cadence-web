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

import { get } from 'lodash-es';
import { statePrefix } from './helpers';
import {
  CROSS_REGION,
  CROSS_REGION_ALLOWED_CROSS_ORIGIN,
  CROSS_REGION_CLUSTER_ORIGIN_LIST,
  CROSS_REGION_IS_LOADING,
  CROSS_REGION_IS_READY,
} from './getter-types';

const getters = {
  [CROSS_REGION]: state => get(state, statePrefix('crossRegion')),
  [CROSS_REGION_ALLOWED_CROSS_ORIGIN]: state =>
    get(state, statePrefix('allowedCrossOrigin')),
  [CROSS_REGION_CLUSTER_ORIGIN_LIST]: state =>
    get(state, statePrefix('clusterOriginList')),
  [CROSS_REGION_IS_LOADING]: (_, getters) => !getters[CROSS_REGION_IS_READY],
  [CROSS_REGION_IS_READY]: state => get(state, statePrefix('isReady')),
};

export default getters;
