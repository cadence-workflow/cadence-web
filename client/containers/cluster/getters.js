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
import {
  CLUSTER_ADVANCED_VISIBILITY_ENABLED,
  CLUSTER_FETCH_ERROR,
  CLUSTER_FETCH_EXPIRY_DATE_TIME,
  CLUSTER_VISIBILITY_FEATURES,
} from './getter-types';
import { CLUSTER_VISIBILITY_FEATURES_ADVANCED_VISIBILITY_ENABLED_KEY } from './constants';

const getters = {
  [CLUSTER_ADVANCED_VISIBILITY_ENABLED]: (_, getters) => {
    const advancedVisibilityEnabledFeature = getters[
      CLUSTER_VISIBILITY_FEATURES
    ].find(
      ({ key }) =>
        key === CLUSTER_VISIBILITY_FEATURES_ADVANCED_VISIBILITY_ENABLED_KEY
    );

    if (advancedVisibilityEnabledFeature) {
      return advancedVisibilityEnabledFeature.enabled;
    }

    return false;
  },
  [CLUSTER_FETCH_ERROR]: state => get(state, 'cluster.error'),
  [CLUSTER_FETCH_EXPIRY_DATE_TIME]: state =>
    get(state, 'cluster.expiryDateTime'),
  [CLUSTER_VISIBILITY_FEATURES]: state =>
    get(state, 'cluster.data.persistenceInfo.visibilityStore.features') || [],
};

export default getters;
