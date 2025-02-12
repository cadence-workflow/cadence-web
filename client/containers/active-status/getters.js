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

import { DOMAIN_IS_READY, DOMAIN_HASH } from '../domain/getter-types';
import {
  ROUTE_PARAMS_WORKFLOW_ID,
  ROUTE_PARAMS_CLUSTER_NAME,
  ROUTE_PARAMS_DOMAIN,
} from '../route/getter-types';
import {
  CROSS_REGION,
  CROSS_REGION_ALLOWED_CROSS_ORIGIN,
  CROSS_REGION_CLUSTER_ORIGIN_LIST,
} from '../cross-region/getter-types';
import {
  ACTIVE_STATUS_CLASSNAME,
  ACTIVE_STATUS_CLUSTER,
  ACTIVE_STATUS_CLUSTER_LIST,
  ACTIVE_STATUS_LABEL,
  ACTIVE_STATUS_SELECT_LIST,
  ACTIVE_STATUS_TAG,
} from './getter-types';
import {
  getClusterFromClusterList,
  getClusterListFromDomainConfigList,
  getFilteredClusterList,
} from './helpers';

const getters = {
  [ACTIVE_STATUS_CLASSNAME]: (_, getters) => {
    const cluster = getters[ACTIVE_STATUS_CLUSTER];

    return cluster && cluster.isActive ? 'active' : 'passive';
  },
  [ACTIVE_STATUS_CLUSTER]: (_, getters) => {
    const allowedCrossOrigin = getters[CROSS_REGION_ALLOWED_CROSS_ORIGIN];
    const clusterList = getters[ACTIVE_STATUS_CLUSTER_LIST];
    const clusterName = getters[ROUTE_PARAMS_CLUSTER_NAME];
    const { origin } = window.location;

    return getClusterFromClusterList({
      allowedCrossOrigin,
      clusterList,
      clusterName,
      origin,
    });
  },
  [ACTIVE_STATUS_CLUSTER_LIST]: (_, getters) => {
    const clusterOriginList = getters[CROSS_REGION_CLUSTER_ORIGIN_LIST];
    const crossRegion = getters[CROSS_REGION];
    const domainHash = getters[DOMAIN_HASH];
    const domainName = getters[ROUTE_PARAMS_DOMAIN];
    const isReady = getters[DOMAIN_IS_READY];

    const domainNamespace = domainHash[domainName];

    if (!domainName || !crossRegion || !isReady) {
      return [];
    }

    const domainConfigList = domainNamespace.global
      ? [domainNamespace.global]
      : domainNamespace.local;

    return getClusterListFromDomainConfigList({
      clusterOriginList,
      domainConfigList,
    });
  },
  [ACTIVE_STATUS_LABEL]: (_, getters) => {
    const cluster = getters[ACTIVE_STATUS_CLUSTER];

    return cluster && cluster.label;
  },
  [ACTIVE_STATUS_SELECT_LIST]: (_, getters) => {
    const allowedCrossOrigin = getters[CROSS_REGION_ALLOWED_CROSS_ORIGIN];
    const clusterList = getters[ACTIVE_STATUS_CLUSTER_LIST];
    const clusterName = getters[ROUTE_PARAMS_CLUSTER_NAME];
    const { origin } = window.location;

    return getFilteredClusterList({
      allowedCrossOrigin,
      clusterList,
      clusterName,
      origin,
    });
  },
  [ACTIVE_STATUS_TAG]: (_, getters) => {
    const cluster = getters[ACTIVE_STATUS_CLUSTER];
    const isReady = getters[DOMAIN_IS_READY];
    const selectList = getters[ACTIVE_STATUS_SELECT_LIST];
    const workflowId = getters[ROUTE_PARAMS_WORKFLOW_ID];

    if (!isReady || !cluster) {
      return 'span';
    }

    const { isGlobalDomain } = cluster;

    return (selectList && selectList.length === 0) ||
      (!isGlobalDomain && workflowId)
      ? 'span'
      : 'select-input';
  },
};

export default getters;
