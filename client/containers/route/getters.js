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
  ROUTE_PARAMS,
  ROUTE_PARAMS_CLUSTER_NAME,
  ROUTE_PARAMS_DOMAIN,
  ROUTE_PARAMS_WORKFLOW_ID,
  ROUTE_QUERY,
} from './getter-types';

const getters = {
  [ROUTE_PARAMS]: state => get(state, 'route.params', {}),
  [ROUTE_PARAMS_CLUSTER_NAME]: (_, getters) =>
    getters[ROUTE_PARAMS].clusterName,
  [ROUTE_PARAMS_DOMAIN]: (_, getters) => getters[ROUTE_PARAMS].domain,
  [ROUTE_PARAMS_WORKFLOW_ID]: (_, getters) => getters[ROUTE_PARAMS].workflowId,
  [ROUTE_QUERY]: state => get(state, 'route.query', {}),
};

export default getters;
