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
import { CLUSTER_FETCH } from '../cluster/action-types';
import { CLUSTER_ADVANCED_VISIBILITY_ENABLED } from '../cluster/getter-types';
import {
  WORKFLOW_LIST_ON_FILTER_CHANGE,
  WORKFLOW_LIST_ON_FILTER_MODE_CLICK,
} from './action-types';
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

const actionsToEvents = {
  onFilterChange: WORKFLOW_LIST_ON_FILTER_CHANGE,
  onFilterModeClick: WORKFLOW_LIST_ON_FILTER_MODE_CLICK,
};

const gettersToProps = {
  fetchWorkflowListUrl: WORKFLOW_LIST_FETCH_WORKFLOW_LIST_URL,
  filterBy: WORKFLOW_LIST_FILTER_BY,
  filterMode: WORKFLOW_LIST_FILTER_MODE,
  filterModeButtonEnabled: CLUSTER_ADVANCED_VISIBILITY_ENABLED,
  filterModeButtonLabel: WORKFLOW_LIST_FILTER_MODE_BUTTON_LABEL,
  isCron: WORKFLOW_LIST_IS_CRON,
  isCronInputVisible: CLUSTER_ADVANCED_VISIBILITY_ENABLED,
  queryString: WORKFLOW_LIST_QUERY_STRING,
  state: WORKFLOW_LIST_STATE,
  status: WORKFLOW_LIST_STATUS,
  statusName: WORKFLOW_LIST_STATUS_NAME,
  workflowId: WORKFLOW_LIST_WORKFLOW_ID,
  workflowName: WORKFLOW_LIST_WORKFLOW_NAME,
};

const lifecycle = {
  created: ({ dispatch }) => dispatch(CLUSTER_FETCH),
};

export default connect({
  actionsToEvents,
  gettersToProps,
  lifecycle,
});
