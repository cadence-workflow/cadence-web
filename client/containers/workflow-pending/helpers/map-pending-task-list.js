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
  PENDING_TASK_KVPS_EXCLUDE_KEYS,
  PENDING_TASK_TYPE_TO_ID_MAP,
  PENDING_TASK_TYPE_TO_DISPLAY_MAP,
} from '../constants';

import getWorkflowLink from './get-workflow-link';
import { getKeyValuePairs } from '~helpers';

const mapPendingTaskItem = ({ clusterName, domain }) => item => {
  const { pendingTaskType, runID } = item;

  const mappedItem = {
    ...item,
    pendingTaskId: `${pendingTaskType}_${
      item[PENDING_TASK_TYPE_TO_ID_MAP[pendingTaskType]]
    }`,
    pendingTaskTypeDisplay: PENDING_TASK_TYPE_TO_DISPLAY_MAP[pendingTaskType],
    ...(runID && {
      runID: getWorkflowLink({ ...item, clusterName, domain }) || runID,
    }),
  };

  return {
    ...mappedItem,
    kvps: getKeyValuePairs({
      clusterName,
      excludes: PENDING_TASK_KVPS_EXCLUDE_KEYS,
      item: mappedItem,
    }),
  };
};

const mapPendingTaskList = ({ clusterName, domain, pendingTaskList }) =>
  pendingTaskList.map(mapPendingTaskItem({ clusterName, domain }));

export default mapPendingTaskList;
