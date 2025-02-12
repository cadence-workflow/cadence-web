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

const formatActivityTaskCancelRequestedEventAttributes = require('./format-activity-task-cancel-requested-event-attributes');
const formatActivityTaskCanceledEventAttributes = require('./format-activity-task-canceled-event-attributes');
const formatActivityTaskCompletedEventAttributes = require('./format-activity-task-completed-event-attributes');
const formatActivityTaskFailedEventAttributes = require('./format-activity-task-failed-event-attributes');
const formatActivityTaskScheduledEventAttributes = require('./format-activity-task-scheduled-event-attributes');
const formatActivityTaskStartedEventAttributes = require('./format-activity-task-started-event-attributes');
const formatActivityTaskTimedOutEventAttributes = require('./format-activity-task-timed-out-event-attributes');
const formatCancelTimerFailedEventAttributes = require('./format-cancel-timer-failed-event-attributes');
const formatChildWorkflowExecutionCanceledEventAttributes = require('./format-child-workflow-execution-canceled-event-attributes');
const formatChildWorkflowExecutionCompletedEventAttributes = require('./format-child-workflow-execution-completed-event-attributes');
const formatChildWorkflowExecutionFailedEventAttributes = require('./format-child-workflow-execution-failed-event-attributes');
const formatChildWorkflowExecutionStartedEventAttributes = require('./format-child-workflow-execution-started-event-attributes');
const formatChildWorkflowExecutionTerminatedEventAttributes = require('./format-child-workflow-execution-terminated-event-attributes');
const formatChildWorkflowExecutionTimedOutEventAttributes = require('./format-child-workflow-execution-timed-out-event-attributes');
const formatDecisionTaskCompletedEventAttributes = require('./format-decision-task-completed-event-attributes');
const formatDecisionTaskFailedEventAttributes = require('./format-decision-task-failed-event-attributes');
const formatDecisionTaskScheduledEventAttributes = require('./format-decision-task-scheduled-event-attributes');
const formatDecisionTaskStartedEventAttributes = require('./format-decision-task-started-event-attributes');
const formatDecisionTaskTimedOutEventAttributes = require('./format-decision-task-timed-out-event-attributes');
const formatExternalWorkflowExecutionCancelRequestedEventAttributes = require('./format-external-workflow-execution-cancel-requested-event-attributes');
const formatExternalWorkflowExecutionSignaledEventAttributes = require('./format-external-workflow-execution-signaled-event-attributes');
const formatMarkerRecordedEventAttributes = require('./format-marker-recorded-event-attributes');
const formatRequestCancelActivityTaskFailedEventAttributes = require('./format-request-cancel-activity-task-failed-event-attributes');
const formatRequestCancelExternalWorkflowExecutionFailedEventAttributes = require('./format-request-cancel-external-workflow-execution-failed-event-attributes');
const formatRequestCancelExternalWorkflowExecutionInitiatedEventAttributes = require('./format-request-cancel-external-workflow-execution-initiated-event-attributes');
const formatSignalExternalWorkflowExecutionFailedEventAttributes = require('./format-signal-external-workflow-execution-failed-event-attributes');
const formatSignalExternalWorkflowExecutionInitiatedEventAttributes = require('./format-signal-external-workflow-execution-initiated-event-attributes');
const formatStartChildWorkflowExecutionFailedEventAttributes = require('./format-start-child-workflow-execution-failed-event-attributes');
const formatStartChildWorkflowExecutionInitiatedEventAttributes = require('./format-start-child-workflow-execution-initiated-event-attributes');
const formatTimerCanceledEventAttributes = require('./format-timer-canceled-event-attributes');
const formatTimerFiredEventAttributes = require('./format-timer-fired-event-attributes');
const formatTimerStartedEventAttributes = require('./format-timer-started-event-attributes');
const formatUpsertWorkflowSearchAttributesEventAttributes = require('./format-upsert-workflow-search-attributes-event-attributes');
const formatWorkflowExecutionCancelRequestedEventAttributes = require('./format-workflow-execution-cancel-requested-event-attributes');
const formatWorkflowExecutionCanceledEventAttributes = require('./format-workflow-execution-canceled-event-attributes');
const formatWorkflowExecutionCompletedEventAttributes = require('./format-workflow-execution-completed-event-attributes');
const formatWorkflowExecutionContinuedAsNewEventAttributes = require('./format-workflow-execution-continued-as-new-event-attributes');
const formatWorkflowExecutionFailedEventAttributes = require('./format-workflow-execution-failed-event-attributes');
const formatWorkflowExecutionSignaledEventAttributes = require('./format-workflow-execution-signaled-event-attributes');
const formatWorkflowExecutionStartedEventAttributes = require('./format-workflow-execution-started-event-attributes');
const formatWorkflowExecutionTerminatedEventAttributes = require('./format-workflow-execution-terminated-event-attributes');

const AttributesFormatterMap = {
  activityTaskCancelRequestedEventAttributes: formatActivityTaskCancelRequestedEventAttributes,
  activityTaskCanceledEventAttributes: formatActivityTaskCanceledEventAttributes,
  activityTaskCompletedEventAttributes: formatActivityTaskCompletedEventAttributes,
  activityTaskFailedEventAttributes: formatActivityTaskFailedEventAttributes,
  activityTaskScheduledEventAttributes: formatActivityTaskScheduledEventAttributes,
  activityTaskStartedEventAttributes: formatActivityTaskStartedEventAttributes,
  activityTaskTimedOutEventAttributes: formatActivityTaskTimedOutEventAttributes,
  cancelTimerFailedEventAttributes: formatCancelTimerFailedEventAttributes,
  childWorkflowExecutionCanceledEventAttributes: formatChildWorkflowExecutionCanceledEventAttributes,
  childWorkflowExecutionCompletedEventAttributes: formatChildWorkflowExecutionCompletedEventAttributes,
  childWorkflowExecutionFailedEventAttributes: formatChildWorkflowExecutionFailedEventAttributes,
  childWorkflowExecutionStartedEventAttributes: formatChildWorkflowExecutionStartedEventAttributes,
  childWorkflowExecutionTerminatedEventAttributes: formatChildWorkflowExecutionTerminatedEventAttributes,
  childWorkflowExecutionTimedOutEventAttributes: formatChildWorkflowExecutionTimedOutEventAttributes,
  decisionTaskCompletedEventAttributes: formatDecisionTaskCompletedEventAttributes,
  decisionTaskFailedEventAttributes: formatDecisionTaskFailedEventAttributes,
  decisionTaskScheduledEventAttributes: formatDecisionTaskScheduledEventAttributes,
  decisionTaskStartedEventAttributes: formatDecisionTaskStartedEventAttributes,
  decisionTaskTimedOutEventAttributes: formatDecisionTaskTimedOutEventAttributes,
  externalWorkflowExecutionCancelRequestedEventAttributes: formatExternalWorkflowExecutionCancelRequestedEventAttributes,
  externalWorkflowExecutionSignaledEventAttributes: formatExternalWorkflowExecutionSignaledEventAttributes,
  markerRecordedEventAttributes: formatMarkerRecordedEventAttributes,
  requestCancelActivityTaskFailedEventAttributes: formatRequestCancelActivityTaskFailedEventAttributes,
  requestCancelExternalWorkflowExecutionFailedEventAttributes: formatRequestCancelExternalWorkflowExecutionFailedEventAttributes,
  requestCancelExternalWorkflowExecutionInitiatedEventAttributes: formatRequestCancelExternalWorkflowExecutionInitiatedEventAttributes,
  signalExternalWorkflowExecutionFailedEventAttributes: formatSignalExternalWorkflowExecutionFailedEventAttributes,
  signalExternalWorkflowExecutionInitiatedEventAttributes: formatSignalExternalWorkflowExecutionInitiatedEventAttributes,
  startChildWorkflowExecutionFailedEventAttributes: formatStartChildWorkflowExecutionFailedEventAttributes,
  startChildWorkflowExecutionInitiatedEventAttributes: formatStartChildWorkflowExecutionInitiatedEventAttributes,
  timerCanceledEventAttributes: formatTimerCanceledEventAttributes,
  timerFiredEventAttributes: formatTimerFiredEventAttributes,
  timerStartedEventAttributes: formatTimerStartedEventAttributes,
  upsertWorkflowSearchAttributesEventAttributes: formatUpsertWorkflowSearchAttributesEventAttributes,
  workflowExecutionCancelRequestedEventAttributes: formatWorkflowExecutionCancelRequestedEventAttributes,
  workflowExecutionCanceledEventAttributes: formatWorkflowExecutionCanceledEventAttributes,
  workflowExecutionCompletedEventAttributes: formatWorkflowExecutionCompletedEventAttributes,
  workflowExecutionContinuedAsNewEventAttributes: formatWorkflowExecutionContinuedAsNewEventAttributes,
  workflowExecutionFailedEventAttributes: formatWorkflowExecutionFailedEventAttributes,
  workflowExecutionSignaledEventAttributes: formatWorkflowExecutionSignaledEventAttributes,
  workflowExecutionStartedEventAttributes: formatWorkflowExecutionStartedEventAttributes,
  workflowExecutionTerminatedEventAttributes: formatWorkflowExecutionTerminatedEventAttributes,
};

const formatHistoryEventDetails = ({ attributes, ...event }) => {
  const formatter = AttributesFormatterMap[attributes];

  if (formatter) {
    return {
      [attributes]: formatter(event[attributes]),
    };
  }

  return event;
};

module.exports = formatHistoryEventDetails;
