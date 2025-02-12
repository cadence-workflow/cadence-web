// Copyright (c) 2022-2025 Uber Technologies Inc.
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

const formatEnum = require('./format-enum');
const formatTimestampToDatetime = require('./format-timestamp-to-datetime');

const formatResponseWorkflowList = ({ executions, nextPageToken }) => ({
  executions: executions.map(
    ({
      closeStatus,
      closeTime,
      executionTime,
      historyLength,
      isCron,
      parentExecutionInfo,
      startTime,
      taskList,
      workflowExecution,
      ...execution
    }) => ({
      ...execution,
      closeStatus: formatEnum(closeStatus, 'WORKFLOW_EXECUTION_CLOSE_STATUS'),
      closeTime: formatTimestampToDatetime(closeTime),
      execution: workflowExecution,
      executionTime: formatTimestampToDatetime(executionTime),
      historyLength: historyLength === '' ? parseInt(historyLength) : null,
      isCron: isCron || null,
      parentDomainId: parentExecutionInfo?.domainId || null,
      parentExecution: parentExecutionInfo?.workflowExecution || null,
      startTime: formatTimestampToDatetime(startTime),
      taskList: taskList
        ? {
            kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
            name: taskList?.name || null,
          }
        : null,
    })
  ),
  nextPageToken,
});

module.exports = formatResponseWorkflowList;
