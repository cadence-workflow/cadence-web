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

import { ROUTE_PARAMS_DOMAIN, ROUTE_QUERY } from '../route/getter-types';
import { FILTER_MODE_BASIC } from './constants';
import {
  WORKFLOW_LIST_FETCH_WORKFLOW_LIST_URL,
  WORKFLOW_LIST_FILTER_BY,
  WORKFLOW_LIST_FILTER_MODE,
  WORKFLOW_LIST_FILTER_MODE_BUTTON_LABEL,
  WORKFLOW_LIST_IS_CRON,
  WORKFLOW_LIST_QUERY_STRING,
  WORKFLOW_LIST_STATE,
  WORKFLOW_LIST_STATUS,
  WORKFLOW_LIST_STATUS_NAME,
  WORKFLOW_LIST_WORKFLOW_ID,
  WORKFLOW_LIST_WORKFLOW_NAME,
} from './getter-types';
import {
  getFetchWorkflowListUrl,
  getFilterBy,
  getFilterModeButtonLabel,
  getIsCron,
  getState,
  getStatus,
} from './helpers';

const getters = {
  [WORKFLOW_LIST_FETCH_WORKFLOW_LIST_URL]: (_, getters) =>
    getFetchWorkflowListUrl({
      domain: getters[ROUTE_PARAMS_DOMAIN],
      filterMode: getters[WORKFLOW_LIST_FILTER_MODE],
      state: getters[WORKFLOW_LIST_STATE],
    }),
  [WORKFLOW_LIST_FILTER_BY]: (_, getters) =>
    getFilterBy(getters[WORKFLOW_LIST_STATUS_NAME]),
  [WORKFLOW_LIST_FILTER_MODE]: (_, getters) =>
    getters[ROUTE_QUERY].filterMode || FILTER_MODE_BASIC,
  [WORKFLOW_LIST_FILTER_MODE_BUTTON_LABEL]: (_, getters) =>
    getFilterModeButtonLabel(getters[WORKFLOW_LIST_FILTER_MODE]),
  [WORKFLOW_LIST_IS_CRON]: (_, getters) =>
    getIsCron(getters[ROUTE_QUERY].isCron),
  [WORKFLOW_LIST_QUERY_STRING]: (_, getters) =>
    getters[ROUTE_QUERY].queryString || '',
  [WORKFLOW_LIST_STATE]: (_, getters) =>
    getState(getters[WORKFLOW_LIST_STATUS_NAME]),
  [WORKFLOW_LIST_STATUS]: (_, getters) =>
    getStatus(getters[ROUTE_QUERY].status),
  [WORKFLOW_LIST_STATUS_NAME]: (_, getters) =>
    getters[WORKFLOW_LIST_STATUS].value,
  [WORKFLOW_LIST_WORKFLOW_ID]: (_, getters) => getters[ROUTE_QUERY].workflowId,
  [WORKFLOW_LIST_WORKFLOW_NAME]: (_, getters) =>
    getters[ROUTE_QUERY].workflowName,
};

export default getters;
