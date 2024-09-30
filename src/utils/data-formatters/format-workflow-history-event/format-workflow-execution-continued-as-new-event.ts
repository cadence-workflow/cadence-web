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

import formatDurationToSeconds from '../format-duration-to-seconds';
import formatEnum from '../format-enum';
import formatFailureDetails from '../format-failure-details';
import formatPayloadMap from '../format-payload-map';
import formatWorkflowEventId from '../format-workflow-event-id';
import formatWorkflowInputPayload from '../format-workflow-input-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionContinuedAsNewEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionContinuedAsNewEvent = ({
  workflowExecutionContinuedAsNewEventAttributes: {
    backoffStartInterval,
    decisionTaskCompletedEventId,
    executionStartToCloseTimeout,
    failure,
    header,
    initiator,
    input,
    memo,
    searchAttributes,
    taskList,
    taskStartToCloseTimeout,
    ...eventAttributes
  },
  ...eventFields
}: WorkflowExecutionContinuedAsNewEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    backoffStartIntervalInSeconds:
      formatDurationToSeconds(backoffStartInterval),
    decisionTaskCompletedEventId: formatWorkflowEventId(
      decisionTaskCompletedEventId
    ),
    executionStartToCloseTimeoutSeconds: formatDurationToSeconds(
      executionStartToCloseTimeout
    ),
    failureDetails: formatFailureDetails(failure),
    failureReason: failure?.reason || '',
    header: formatPayloadMap(header, 'fields'),
    initiator: formatEnum(initiator, 'CONTINUE_AS_NEW_INITIATOR'),
    input: formatWorkflowInputPayload(input),
    memo: formatPayloadMap(memo, 'fields'),
    searchAttributes: formatPayloadMap(searchAttributes, 'indexedFields'),
    taskList: {
      kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
      name: taskList?.name || null,
    },
    taskStartToCloseTimeoutSeconds: formatDurationToSeconds(
      taskStartToCloseTimeout
    ),
  };
};

export default formatWorkflowExecutionContinuedAsNewEvent;
