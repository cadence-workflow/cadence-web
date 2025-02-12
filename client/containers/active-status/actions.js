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

import { CROSS_REGION_ALLOWED_CROSS_ORIGIN } from '../cross-region/getter-types';
import {
  ROUTE_PARAMS_CLUSTER_NAME,
  ROUTE_PARAMS_DOMAIN,
} from '../route/getter-types';
import { ACTIVE_STATUS_ON_CHANGE } from './action-types';
import { getHrefFromCluster } from './helpers';

const actions = {
  [ACTIVE_STATUS_ON_CHANGE]: ({ dispatch, getters }, cluster) => {
    const allowedCrossOrigin = getters[CROSS_REGION_ALLOWED_CROSS_ORIGIN];
    const clusterName = getters[ROUTE_PARAMS_CLUSTER_NAME];
    const domainName = getters[ROUTE_PARAMS_DOMAIN];
    const { origin, pathname } = window.location;

    const href = getHrefFromCluster({
      allowedCrossOrigin,
      cluster,
      clusterName,
      domainName,
      origin,
      pathname,
    });

    window.location = href;
  },
};

export default actions;
