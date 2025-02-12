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
  PENDING_TASK_TYPE_ACTIVITY,
  PENDING_TASK_TYPE_CHILD_WORKFLOW,
  PENDING_TASK_TYPE_DECISION,
} from '../workflow/constants';
import {
  WORKFLOW_EXECUTION_PENDING_ACTIVITIES,
  WORKFLOW_EXECUTION_PENDING_CHILDREN,
  WORKFLOW_EXECUTION_PENDING_TASKS,
  WORKFLOW_EXECUTION_PENDING_DECISIONS,
} from '../workflow/getter-types';

export const PENDING_TASK_FILTER_ACTIVITIES = 'activities';
export const PENDING_TASK_FILTER_ALL = 'all';
export const PENDING_TASK_FILTER_CHILDREN = 'child workflows';
export const PENDING_TASK_FILTER_DECISIONS = 'decisions';

export const PENDING_TASK_FILTERS = [
  PENDING_TASK_FILTER_ALL,
  PENDING_TASK_FILTER_ACTIVITIES,
  PENDING_TASK_FILTER_CHILDREN,
  PENDING_TASK_FILTER_DECISIONS,
];

export const PENDING_TASK_FILTER_TO_EMPTY_MESSAGE_MAP = {
  [PENDING_TASK_FILTER_ACTIVITIES]: 'No pending activities',
  [PENDING_TASK_FILTER_ALL]: 'No pending tasks',
  [PENDING_TASK_FILTER_CHILDREN]: 'No pending child workflows',
  [PENDING_TASK_FILTER_DECISIONS]: 'No pending decisions',
};

export const PENDING_TASK_FILTER_TO_GETTER_TYPE_MAP = {
  [PENDING_TASK_FILTER_ACTIVITIES]: WORKFLOW_EXECUTION_PENDING_ACTIVITIES,
  [PENDING_TASK_FILTER_ALL]: WORKFLOW_EXECUTION_PENDING_TASKS,
  [PENDING_TASK_FILTER_CHILDREN]: WORKFLOW_EXECUTION_PENDING_CHILDREN,
  [PENDING_TASK_FILTER_DECISIONS]: WORKFLOW_EXECUTION_PENDING_DECISIONS,
};

export const PENDING_TASK_KVPS_EXCLUDE_KEYS = [
  'pendingTaskId',
  'pendingTaskType',
  'pendingTaskTypeDisplay',
];

export const PENDING_TASK_TYPE_TO_ID_MAP = {
  [PENDING_TASK_TYPE_ACTIVITY]: 'activityID',
  [PENDING_TASK_TYPE_CHILD_WORKFLOW]: 'initiatedID',
  [PENDING_TASK_TYPE_DECISION]: 'scheduledTimestamp',
};

export const PENDING_TASK_TYPE_TO_DISPLAY_MAP = {
  [PENDING_TASK_TYPE_ACTIVITY]: 'PendingActivityTask',
  [PENDING_TASK_TYPE_CHILD_WORKFLOW]: 'PendingChildWorkflowTask',
  [PENDING_TASK_TYPE_DECISION]: 'PendingDecisionTask',
};
