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
  ROUTE_PARAMS_CLUSTER_NAME,
  ROUTE_PARAMS_DOMAIN,
} from '../route/getter-types';
import {
  CROSS_REGION,
  CROSS_REGION_ALLOWED_CROSS_ORIGIN,
  CROSS_REGION_CLUSTER_ORIGIN_LIST,
} from '../cross-region/getter-types';
import {
  DOMAIN_CROSS_ORIGIN,
  DOMAIN_CURRENT,
  DOMAIN_ERROR,
  DOMAIN_HASH,
  DOMAIN_IS_LOADING,
  DOMAIN_IS_READY,
  DOMAIN_NAMESPACE,
} from './getter-types';
import { statePrefix, getDomain, getCrossOrigin } from './helpers';
import { hasExpired } from '~helpers';

const getters = {
  [DOMAIN_CURRENT]: (_, getters) => {
    const clusterName = getters[ROUTE_PARAMS_CLUSTER_NAME];
    const domainNamespace = getters[DOMAIN_NAMESPACE];

    return getDomain({ clusterName, domainNamespace });
  },
  [DOMAIN_NAMESPACE]: (_, getters) => {
    const domainName = getters[ROUTE_PARAMS_DOMAIN];
    const domainHash = getters[DOMAIN_HASH];

    return domainHash[domainName];
  },
  [DOMAIN_ERROR]: (_, getters) => {
    const domainNamespace = getters[DOMAIN_NAMESPACE];

    return domainNamespace && domainNamespace.error;
  },
  [DOMAIN_HASH]: state => get(state, statePrefix('domainHash')),
  [DOMAIN_IS_LOADING]: (_, getters) =>
    getters[CROSS_REGION] &&
    getters[ROUTE_PARAMS_DOMAIN] &&
    !getters[DOMAIN_ERROR] &&
    hasExpired(get(getters[DOMAIN_CURRENT], 'expiryDateTime')),
  [DOMAIN_IS_READY]: (_, getters) =>
    !getters[DOMAIN_IS_LOADING] && !getters[DOMAIN_ERROR],
  [DOMAIN_CROSS_ORIGIN]: (_, getters) => {
    const allowedCrossOrigin = getters[CROSS_REGION_ALLOWED_CROSS_ORIGIN];
    const clusterName = getters[ROUTE_PARAMS_CLUSTER_NAME];
    const clusterOriginList = getters[CROSS_REGION_CLUSTER_ORIGIN_LIST];
    const crossRegion = getters[CROSS_REGION];
    const domain = getters[DOMAIN_CURRENT];

    return getCrossOrigin({
      allowedCrossOrigin,
      clusterName,
      clusterOriginList,
      crossRegion,
      domain,
    });
  },
};

export default getters;
