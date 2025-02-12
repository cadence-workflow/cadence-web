// Copyright (c) 2017-2025 Uber Technologies Inc.
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

import getSummaryWorkflowStatus from './get-summary-workflow-status';
import parentWorkflowLink from './parent-workflow-link';
import { getJsonStringObject, getKeyValuePairs } from '~helpers';

const getSummary = ({ clusterName, events, isWorkflowRunning, workflow }) => {
  const formattedWorkflow = workflow.pendingActivities
    ? {
        ...workflow,
        pendingActivities: workflow.pendingActivities.map(item => ({
          ...item,
          kvps: getKeyValuePairs({ clusterName, item }),
        })),
      }
    : workflow;

  if (!events || !events.length) {
    return {
      input: undefined,
      isWorkflowRunning,
      cronSchedule: undefined,
      parentWorkflowRoute: undefined,
      result: undefined,
      wfStatus: undefined,
      workflow: formattedWorkflow,
    };
  }

  const firstEvent = events[0];
  const lastEvent =
    workflow.workflowExecutionInfo.closeEvent ||
    (events.length > 1 && events[events.length - 1]);

  const input = getJsonStringObject(firstEvent.details.input);

  const workflowCompletedEvent =
    lastEvent && lastEvent.eventType.startsWith('WorkflowExecution')
      ? lastEvent
      : undefined;

  const result = workflowCompletedEvent
    ? getJsonStringObject(
        workflowCompletedEvent.details.result || workflowCompletedEvent.details
      )
    : undefined;

  const wfStatus = getSummaryWorkflowStatus({
    clusterName,
    isWorkflowRunning,
    workflow,
    workflowCompletedEvent,
  });

  const parentWorkflowRoute = parentWorkflowLink({
    clusterName,
    eventDetails: firstEvent.details,
  });

  return {
    input,
    cronSchedule: firstEvent.details.cronSchedule,
    isWorkflowRunning,
    parentWorkflowRoute,
    result,
    wfStatus,
    workflow: formattedWorkflow,
  };
};

export default getSummary;
