// Copyright (c) 2022-2024 Uber Technologies Inc.
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

import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import formatDurationToSeconds from '../format-duration-to-seconds';
import formatEnum from '../format-enum';
import formatFailureDetails from '../format-failure-details';
import formatPayloadMap from '../format-payload-map';
import formatPrevAutoResetPoints from '../format-prev-auto-reset-points';
import formatRetryPolicy from '../format-retry-policy';
import formatTimestampToDatetime from '../format-timestamp-to-datetime';
import formatWorkflowInputPayload from '../format-workflow-input-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionStartedEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionStartedEvent = ({
  workflowExecutionStartedEventAttributes: {
    attempt,
    continuedExecutionRunId,
    continuedFailure,
    cronSchedule,
    executionStartToCloseTimeout,
    expirationTime,
    firstDecisionTaskBackoff,
    firstExecutionRunId,
    firstScheduledTime,
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
  },
  ...eventFields
}: WorkflowExecutionStartedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    taskList: {
      kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
      name: taskList?.name || null,
    },
    input: formatWorkflowInputPayload(input),
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
    firstScheduledTimeNano: firstScheduledTime
      ? parseGrpcTimestamp(firstScheduledTime)
      : null,
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
  };
};

export default formatWorkflowExecutionStartedEvent;
