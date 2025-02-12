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
  PENDING_TASK_TYPE_ACTIVITY,
  PENDING_TASK_TYPE_CHILD_WORKFLOW,
  PENDING_TASK_TYPE_DECISION,
} from './constants';
import {
  WORKFLOW_EXECUTION,
  WORKFLOW_EXECUTION_IS_LOADING,
  WORKFLOW_EXECUTION_PENDING_ACTIVITIES,
  WORKFLOW_EXECUTION_PENDING_CHILDREN,
  WORKFLOW_EXECUTION_PENDING_DECISIONS,
  WORKFLOW_EXECUTION_PENDING_TASK_COUNT,
  WORKFLOW_EXECUTION_PENDING_TASKS,
  WORKFLOW_EXECUTION_TASK_LIST_NAME,
} from './getter-types';

const getters = {
  [WORKFLOW_EXECUTION]: state => get(state, 'workflow.execution'),
  [WORKFLOW_EXECUTION_IS_LOADING]: state =>
    get(state, 'workflow.isLoading') || false,
  [WORKFLOW_EXECUTION_PENDING_ACTIVITIES]: state =>
    (get(state, 'workflow.execution.pendingActivities') || []).map(item => ({
      ...item,
      pendingTaskType: PENDING_TASK_TYPE_ACTIVITY,
    })),
  [WORKFLOW_EXECUTION_PENDING_CHILDREN]: state =>
    (get(state, 'workflow.execution.pendingChildren') || []).map(item => ({
      ...item,
      pendingTaskType: PENDING_TASK_TYPE_CHILD_WORKFLOW,
    })),
  [WORKFLOW_EXECUTION_PENDING_DECISIONS]: state => {
    const pendingDecision = get(state, 'workflow.execution.pendingDecision');

    if (!pendingDecision) {
      return [];
    }

    return [
      {
        ...pendingDecision,
        pendingTaskType: PENDING_TASK_TYPE_DECISION,
      },
    ];
  },
  [WORKFLOW_EXECUTION_PENDING_TASK_COUNT]: (_, getters) =>
    getters[WORKFLOW_EXECUTION_PENDING_TASKS].length,
  [WORKFLOW_EXECUTION_PENDING_TASKS]: (_, getters) => [
    ...getters[WORKFLOW_EXECUTION_PENDING_ACTIVITIES],
    ...getters[WORKFLOW_EXECUTION_PENDING_CHILDREN],
    ...getters[WORKFLOW_EXECUTION_PENDING_DECISIONS],
  ],
  [WORKFLOW_EXECUTION_TASK_LIST_NAME]: state =>
    get(state, 'workflow.execution.executionConfiguration.taskList.name') || '',
};

export default getters;
