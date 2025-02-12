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

import { connect } from 'vuex-connect';
import { ROUTE_REPLACE } from '../route/action-types';
import {
  ROUTE_PARAMS_CLUSTER_NAME,
  ROUTE_PARAMS_DOMAIN,
} from '../route/getter-types';
import { ACTIVE_STATUS_CLUSTER } from '../active-status/getter-types';
import {
  DOMAIN_FETCH,
  DOMAIN_ON_MOUNT,
  DOMAIN_CHANGE_ORIGIN,
} from './action-types';
import {
  DOMAIN_ERROR,
  DOMAIN_IS_LOADING,
  DOMAIN_IS_READY,
  DOMAIN_CROSS_ORIGIN,
} from './getter-types';

const actionsToEvents = {
  onClusterChange: DOMAIN_FETCH,
  onDomainChange: DOMAIN_FETCH,
  onOriginChange: DOMAIN_CHANGE_ORIGIN,
};

const gettersToProps = {
  clusterName: ROUTE_PARAMS_CLUSTER_NAME,
  activeCluster: ACTIVE_STATUS_CLUSTER,
  domainName: ROUTE_PARAMS_DOMAIN,
  error: DOMAIN_ERROR,
  isLoading: DOMAIN_IS_LOADING,
  isReady: DOMAIN_IS_READY,
  origin: DOMAIN_CROSS_ORIGIN,
};

const lifecycle = {
  mounted: ({ dispatch }) => dispatch(DOMAIN_ON_MOUNT),
  updated({ dispatch, state }) {
    const urlParams = state.route.params;
    const routeSupportsClusterNameParam = urlParams?.hasOwnProperty(
      'clusterName'
    );

    const hasClusterNameParam = Boolean(urlParams.clusterName);

    if (
      routeSupportsClusterNameParam &&
      !hasClusterNameParam &&
      this.activeCluster?.clusterName
    ) {
      // in some cases users have urls that are generic (with no cluster name specified) those are used when we want to auto redirect the user to one of the clusters by default without carring about which cluster.
      dispatch(ROUTE_REPLACE, {
        name: state.route.name,
        query: state.route.query,
        params: {
          ...state.route.params,
          clusterName: this.activeCluster?.clusterName,
        },
      });
    }
  },
};

export default connect({
  actionsToEvents,
  gettersToProps,
  lifecycle,
});
