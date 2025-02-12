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

import {
  ROUTE_PARAMS_CLUSTER_NAME,
  ROUTE_PARAMS_DOMAIN,
} from '../route/getter-types';
import {
  CROSS_REGION_ALLOWED_CROSS_ORIGIN,
  CROSS_REGION_CLUSTER_ORIGIN_LIST,
} from '../cross-region/getter-types';
import {
  DOMAIN_CHANGE_ORIGIN,
  DOMAIN_FETCH,
  DOMAIN_ON_MOUNT,
} from './action-types';
import { DOMAIN_CROSS_ORIGIN, DOMAIN_IS_READY } from './getter-types';
import {
  DOMAIN_RESET_STATE,
  DOMAIN_SET_DOMAIN,
  DOMAIN_SET_ERROR,
} from './mutation-types';
import { httpService } from '~services';
import { getExpiryDateTimeFromNow } from '~helpers';

const actions = {
  [DOMAIN_FETCH]: async ({ commit, getters }) => {
    const clusterName = getters[ROUTE_PARAMS_CLUSTER_NAME];
    const domainName = getters[ROUTE_PARAMS_DOMAIN];
    const ready = getters[DOMAIN_IS_READY];
    const allowedCrossOrigin = getters[CROSS_REGION_ALLOWED_CROSS_ORIGIN];
    const clusterOriginList = getters[CROSS_REGION_CLUSTER_ORIGIN_LIST];

    if (ready) {
      return;
    }

    commit(DOMAIN_RESET_STATE, domainName);

    const cluster =
      allowedCrossOrigin &&
      clusterName &&
      clusterOriginList &&
      clusterOriginList.find(
        ({ clusterName: matchClusterName }) => matchClusterName === clusterName
      );
    const origin = (cluster && cluster.origin) || '';

    try {
      const domain = await httpService.get(
        `${origin}/api/domains/${domainName}`
      );

      if (allowedCrossOrigin && !domain.isGlobalDomain) {
        const fetchList = clusterOriginList
          .filter(
            ({ clusterName }) =>
              clusterName !== domain.replicationConfiguration.activeClusterName
          )
          .map(({ origin }) => async () => {
            try {
              const domainConfig = await httpService.get(
                `${origin}/api/domains/${domainName}`
              );

              return domainConfig;
            } catch (error) {
              console.warn(
                `Unable to resolve domain configuration for domain = "${domainName}" and origin = "${origin}".`
              );
            }
          });

        const domainList = (
          await Promise.all(fetchList.map(callback => callback()))
        ).filter(response => !!response);

        domainList.forEach(localDomain => {
          localDomain.expiryDateTime = getExpiryDateTimeFromNow();
          commit(DOMAIN_SET_DOMAIN, localDomain);
        });
      }

      domain.expiryDateTime = getExpiryDateTimeFromNow();
      commit(DOMAIN_SET_DOMAIN, domain);
    } catch (error) {
      console.warn(
        `Failed to fetch domain configuration for "${domainName}" from "${origin}".`
      );
      console.warn(error);
      commit(DOMAIN_SET_ERROR, {
        domainName,
        error: `An error occurred while trying to fetch domain "${domainName}". Please check the domain is correct and try again.`,
      });
    }
  },
  [DOMAIN_ON_MOUNT]: ({ dispatch }) => {
    dispatch(DOMAIN_CHANGE_ORIGIN);
    dispatch(DOMAIN_FETCH);
  },
  [DOMAIN_CHANGE_ORIGIN]: ({ getters }) => {
    const origin = getters[DOMAIN_CROSS_ORIGIN];

    httpService.setOrigin(origin);
  },
};

export default actions;
