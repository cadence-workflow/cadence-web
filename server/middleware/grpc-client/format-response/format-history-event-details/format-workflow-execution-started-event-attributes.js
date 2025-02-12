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

const formatEnum = require('../format-enum');
const formatFailureDetails = require('../format-failure-details');
const formatInputPayload = require('../format-input-payload');
const formatPayloadMap = require('../format-payload-map');
const formatTimestampToDatetime = require('../format-timestamp-to-datetime');
const formatDurationToSeconds = require('../format-duration-to-seconds');
const formatRetryPolicy = require('./format-retry-policy');
const formatPrevAutoResetPoints = require('./format-prev-auto-reset-points');

const formatWorkflowExecutionStartedEventAttributes = ({
  attempt,
  continuedExecutionRunId,
  continuedFailure,
  cronSchedule,
  executionStartToCloseTimeout,
  expirationTime,
  firstDecisionTaskBackoff,
  firstExecutionRunId,
  firstScheduledTimeNano,
  identity,
  initiator,
  input,
  memo,
  originalExecutionRunId,
  parentExecutionInfo,
  prevAutoResetPoints,
  retryPolicy,
  searchAttributes,
  taskList,
  taskStartToCloseTimeout,
  ...eventAttributes
}) => ({
  ...eventAttributes,
  taskList: {
    kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
    name: taskList?.name || null,
  },
  input: formatInputPayload(input),
  executionStartToCloseTimeoutSeconds: formatDurationToSeconds(
    executionStartToCloseTimeout
  ),
  taskStartToCloseTimeoutSeconds: formatDurationToSeconds(
    taskStartToCloseTimeout
  ),
  attempt: attempt || null,
  continuedExecutionRunId: continuedExecutionRunId || null,
  continuedFailureDetails: formatFailureDetails(continuedFailure),
  continuedFailureReason: continuedFailure?.reason || null,
  cronSchedule: cronSchedule || null,
  expirationTimestamp: formatTimestampToDatetime(expirationTime),
  firstDecisionTaskBackoffSeconds: formatDurationToSeconds(
    firstDecisionTaskBackoff
  ),
  firstExecutionRunId: firstExecutionRunId || null,
  firstScheduledTimeNano: firstScheduledTimeNano || null,
  identity: identity || null,
  initiator: formatEnum(initiator, 'CONTINUE_AS_NEW_INITIATOR'),
  memo: formatPayloadMap(memo, 'fields'),
  originalExecutionRunId: originalExecutionRunId || null,
  parentInitiatedEventId: parentExecutionInfo?.initiatedId
    ? parseInt(parentExecutionInfo.initiatedId)
    : null,
  parentWorkflowDomain: parentExecutionInfo?.domainName || null,
  parentWorkflowExecution: parentExecutionInfo?.workflowExecution || null,
  prevAutoResetPoints: formatPrevAutoResetPoints(prevAutoResetPoints),
  retryPolicy: formatRetryPolicy(retryPolicy),
  searchAttributes: formatPayloadMap(searchAttributes, 'indexedFields'),
});

module.exports = formatWorkflowExecutionStartedEventAttributes;
