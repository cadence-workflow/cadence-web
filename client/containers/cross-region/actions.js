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

import { CROSS_REGION_FETCH } from './action-types';
import { CROSS_REGION_IS_READY } from './getter-types';
import {
  CROSS_REGION_RESET_STATE,
  CROSS_REGION_SET_ALLOWED_CROSS_ORIGIN,
  CROSS_REGION_SET_CLUSTER_ORIGIN_LIST,
  CROSS_REGION_SET_CROSS_REGION,
  CROSS_REGION_SET_IS_READY,
} from './mutation-types';
import { featureFlagService } from '~services';

const actions = {
  [CROSS_REGION_FETCH]: async ({ commit, getters }) => {
    const ready = getters[CROSS_REGION_IS_READY];

    if (ready) {
      return;
    }

    commit(CROSS_REGION_RESET_STATE);

    const crossRegion = await featureFlagService.isFeatureFlagEnabled({
      name: 'crossRegion',
    });

    commit(CROSS_REGION_SET_CROSS_REGION, crossRegion);

    if (!crossRegion) {
      commit(CROSS_REGION_SET_IS_READY, true);

      return;
    }

    const { origin } = window.location;
    const [allowedCrossOrigin, clusterOriginList] = await Promise.all([
      featureFlagService.isFeatureFlagEnabled({
        name: 'crossRegion.allowedCrossOrigin',
        params: {
          origin,
        },
      }),
      featureFlagService.getConfiguration({
        name: 'crossRegion.clusterOriginList',
      }),
    ]);

    commit(CROSS_REGION_SET_ALLOWED_CROSS_ORIGIN, allowedCrossOrigin);
    commit(CROSS_REGION_SET_CLUSTER_ORIGIN_LIST, clusterOriginList);
    commit(CROSS_REGION_SET_IS_READY, true);
  },
};

export default actions;
