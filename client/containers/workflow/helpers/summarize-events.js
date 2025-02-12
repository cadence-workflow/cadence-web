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

import moment from 'moment';
import parentWorkflowLink from './parent-workflow-link';
import workflowLink from './workflow-link';
import { WORKFLOW_EVENT_TYPE } from '~constants';
import { shortName } from '~helpers';

export const summarizeEvents = ({ clusterName }) => ({
  [WORKFLOW_EVENT_TYPE.ActivityTaskCanceled]: eventDetails => ({}),
  [WORKFLOW_EVENT_TYPE.ActivityTaskCancelRequested]: eventDetails => ({
    ID: eventDetails.activityId,
  }),
  [WORKFLOW_EVENT_TYPE.ActivityTaskCompleted]: eventDetails => ({
    result: eventDetails.result,
  }),
  [WORKFLOW_EVENT_TYPE.ActivityTaskFailed]: eventDetails => ({
    details: eventDetails.details,
    reason: eventDetails.reason,
  }),
  [WORKFLOW_EVENT_TYPE.ActivityTaskScheduled]: eventDetails => ({
    'Close Timeout': moment
      .duration(eventDetails.scheduleToCloseTimeoutSeconds, 'seconds')
      .format(),
    ID: eventDetails.activityId,
    input: eventDetails.input,
    Name: shortName(eventDetails.activityType.name),
  }),
  [WORKFLOW_EVENT_TYPE.ActivityTaskStarted]: eventDetails => ({
    attempt: eventDetails.attempt,
    identity: eventDetails.identity,
    requestId: eventDetails.requestId,
  }),
  [WORKFLOW_EVENT_TYPE.ActivityTaskTimedOut]: eventDetails => ({
    'Timeout Type': eventDetails.timeoutType,
  }),
  [WORKFLOW_EVENT_TYPE.ChildWorkflowExecutionCompleted]: eventDetails => ({
    result: eventDetails.result,
    Workflow: workflowLink({ clusterName, eventDetails, short: true }),
  }),
  [WORKFLOW_EVENT_TYPE.ChildWorkflowExecutionStarted]: eventDetails => ({
    Workflow: workflowLink({ clusterName, eventDetails }),
  }),
  [WORKFLOW_EVENT_TYPE.DecisionTaskCompleted]: eventDetails => ({
    identity: eventDetails.identity,
  }),
  [WORKFLOW_EVENT_TYPE.DecisionTaskScheduled]: eventDetails => ({
    Tasklist: eventDetails.taskList.name,
    Timeout: moment
      .duration(eventDetails.startToCloseTimeoutSeconds, 'seconds')
      .format(),
  }),
  [WORKFLOW_EVENT_TYPE.DecisionTaskStarted]: eventDetails => ({
    requestId: eventDetails.requestId,
  }),
  [WORKFLOW_EVENT_TYPE.DecisionTaskTimedOut]: eventDetails => ({
    'Timeout Type': eventDetails.timeoutType,
  }),
  [WORKFLOW_EVENT_TYPE.ExternalWorkflowExecutionSignaled]: eventDetails => ({
    Workflow: workflowLink({ clusterName, eventDetails }),
  }),
  [WORKFLOW_EVENT_TYPE.MarkerRecorded]: eventDetails => {
    const details = eventDetails.details || {};

    if (eventDetails.markerName === 'LocalActivity') {
      const la = { 'Local Activity ID': details.ActivityID };

      if (details.ErrJSON) {
        la.Error = JSON.tryParse(details.ErrJSON) || details.ErrJSON;
      }

      if (details.ErrReason) {
        la.reason = details.ErrReason;
      }

      if (details.ResultJSON) {
        la.result = JSON.tryParse(details.ResultJSON) || details.ResultJSON;
      }

      return la;
    }

    if (eventDetails.markerName === 'Version') {
      return {
        Details: details[0],
        Version: details[1],
      };
    }

    if (eventDetails.markerName === 'SideEffect') {
      if (!Array.isArray(details)) {
        // Java client
        return {
          data: details,
        };
      }

      // Go client
      return {
        data: JSON.tryParse(atob(details[1])) || details[1],
        'Side Effect ID': details[0],
      };
    }

    return eventDetails;
  },
  [WORKFLOW_EVENT_TYPE.SignalExternalWorkflowExecutionInitiated]: eventDetails => ({
    input: eventDetails.input,
    signal: eventDetails.signalName,
    Workflow: workflowLink({ clusterName, eventDetails }),
  }),
  [WORKFLOW_EVENT_TYPE.StartChildWorkflowExecutionInitiated]: eventDetails => ({
    input: eventDetails.input,
    Tasklist: eventDetails.taskList.name,
    Workflow: shortName(eventDetails.workflowType.name),
  }),
  [WORKFLOW_EVENT_TYPE.TimerStarted]: eventDetails => ({
    'Fire Timeout': moment
      .duration(eventDetails.startToFireTimeoutSeconds, 'seconds')
      .format(),
    'Timer ID': eventDetails.timerId,
  }),
  [WORKFLOW_EVENT_TYPE.WorkflowExecutionStarted]: eventDetails => {
    const summary = {
      'Close Timeout': moment
        .duration(eventDetails.executionStartToCloseTimeoutSeconds, 'seconds')
        .format(),
      identity: eventDetails.identity,
      input: eventDetails.input,
      Parent: undefined,
      Workflow: eventDetails.workflowType
        ? shortName(eventDetails.workflowType.name)
        : '',
    };
    const wfLink = parentWorkflowLink({ clusterName, eventDetails });

    if (wfLink) {
      summary.Parent = {
        routeLink: wfLink.to,
        text: wfLink.text,
      };
    }

    return summary;
  },
});
