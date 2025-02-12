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
  ROUTE_QUERY,
} from '../route/getter-types';

import { PENDING_TASK_FILTER_TO_EMPTY_MESSAGE_MAP } from './constants';
import {
  WORKFLOW_PENDING_ACTIVE_FILTER,
  WORKFLOW_PENDING_ACTIVE_FILTER_EMPTY_MESSAGE,
  WORKFLOW_PENDING_ACTIVE_PENDING_TASK_LIST,
} from './getter-types';
import { mapFilterToGetterType, mapPendingTaskList } from './helpers';

const getters = {
  [WORKFLOW_PENDING_ACTIVE_FILTER]: (_, getters) =>
    getters[ROUTE_QUERY].filter || 'all',
  [WORKFLOW_PENDING_ACTIVE_FILTER_EMPTY_MESSAGE]: (_, getters) => {
    const filter = getters[WORKFLOW_PENDING_ACTIVE_FILTER];

    return PENDING_TASK_FILTER_TO_EMPTY_MESSAGE_MAP[filter] || 'No results';
  },
  [WORKFLOW_PENDING_ACTIVE_PENDING_TASK_LIST]: (_, getters) => {
    const clusterName = getters[ROUTE_PARAMS_CLUSTER_NAME];
    const domain = getters[ROUTE_PARAMS_DOMAIN];
    const filter = getters[WORKFLOW_PENDING_ACTIVE_FILTER];
    const getterType = mapFilterToGetterType(filter);
    const pendingTaskList = getters[getterType] || [];

    return mapPendingTaskList({
      clusterName,
      domain,
      pendingTaskList,
    });
  },
};

export default getters;
