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
const formatFailureDetails = require('./format-failure-details');
const formatTimestampToDatetime = require('./format-timestamp-to-datetime');
const formatDurationToSeconds = require('./format-duration-to-seconds');

const formatResponseDescribeWorkflow = ({
  executionConfiguration: {
    executionStartToCloseTimeout,
    taskList,
    taskStartToCloseTimeout,
  },
  pendingActivities,
  pendingChildren,
  pendingDecision,
  workflowExecutionInfo,
  ...response
}) => ({
  ...response,
  executionConfiguration: {
    executionStartToCloseTimeoutSeconds: formatDurationToSeconds(
      executionStartToCloseTimeout
    ),
    taskList: {
      kind: taskList?.kind
        ? formatEnum(taskList?.kind, 'TASK_LIST_KIND')
        : null,
      name: taskList?.name || null,
    },
    taskStartToCloseTimeoutSeconds: formatDurationToSeconds(
      taskStartToCloseTimeout
    ),
  },
  pendingActivities: pendingActivities?.length
    ? pendingActivities.map(
        ({
          activityId,
          expirationTime,
          lastFailure,
          lastHeartbeatTime,
          lastStartedTime,
          scheduledTime,
          state,
          ...pendingActivity
        }) => ({
          ...pendingActivity,
          activityID: parseInt(activityId),
          expirationTimestamp: formatTimestampToDatetime(expirationTime),
          lastFailureDetails: formatFailureDetails(lastFailure),
          lastFailureReason: lastFailure?.reason || null,
          lastHeartbeatTimestamp: formatTimestampToDatetime(lastHeartbeatTime),
          lastStartedTimestamp: formatTimestampToDatetime(lastStartedTime),
          scheduledTimestamp: formatTimestampToDatetime(scheduledTime),
          state: formatEnum(state, 'PENDING_ACTIVITY_STATE'),
        })
      )
    : null,
  pendingChildren: pendingChildren?.length
    ? pendingChildren.map(
        ({
          initiatedId,
          parentClosePolicy,
          workflowExecution,
          ...pendingChild
        }) => ({
          ...pendingChild,
          initiatedID: parseInt(initiatedId),
          parentClosePolicy: formatEnum(
            parentClosePolicy,
            'PARENT_CLOSE_POLICY'
          ),
          runID: workflowExecution?.runId || null,
          workflowID: workflowExecution?.workflowId || null,
        })
      )
    : null,
  pendingDecision: pendingDecision
    ? {
        attempt: pendingDecision.attempt,
        originalScheduledTimestamp: formatTimestampToDatetime(
          pendingDecision.originalScheduledTime
        ),
        scheduledTimestamp: formatTimestampToDatetime(
          pendingDecision.scheduledTime
        ),
        startedTimestamp: formatTimestampToDatetime(
          pendingDecision.startedTime
        ),
        state: formatEnum(pendingDecision.state, 'PENDING_DECISION_STATE'),
      }
    : null,
  workflowExecutionInfo: workflowExecutionInfo
    ? {
        ...workflowExecutionInfo,
        autoResetPoints: {
          points:
            workflowExecutionInfo?.autoResetPoints?.points.map(
              ({ createdTime, expiringTime, ...point }) => ({
                ...point,
                createdTimeNano: formatTimestampToDatetime(createdTime),
                expiringTimeNano: formatTimestampToDatetime(expiringTime),
              })
            ) || null,
        },
        closeStatus: workflowExecutionInfo?.closeStatus
          ? formatEnum(
              workflowExecutionInfo?.closeStatus,
              'WORKFLOW_EXECUTION_CLOSE_STATUS'
            )
          : null,
        closeTime:
          formatTimestampToDatetime(workflowExecutionInfo?.closeTime) || null,
        execution: workflowExecutionInfo?.workflowExecution || null,
        executionTime:
          formatTimestampToDatetime(workflowExecutionInfo?.executionTime) ||
          null,
        historyLength: parseInt(workflowExecutionInfo?.historyLength) || null,
        startTime:
          formatTimestampToDatetime(workflowExecutionInfo?.startTime) || null,
      }
    : null,
});

module.exports = formatResponseDescribeWorkflow;
