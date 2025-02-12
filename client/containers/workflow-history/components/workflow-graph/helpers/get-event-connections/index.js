// Copyright (c) 2020-2025 Uber Technologies Inc.
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

import ActivityTaskCancelRequested from './activity-task-cancel-requested';
import ActivityTaskCanceled from './activity-task-canceled';
import ActivityTaskCompleted from './activity-task-completed';
import ActivityTaskFailed from './activity-task-failed';
import ActivityTaskScheduled from './activity-task-scheduled';
import ActivityTaskStarted from './activity-task-started';
import ActivityTaskTimedOut from './activity-task-timed-out';
import CancelTimerFailed from './cancel-timer-failed';
import ChildWorkflowExecutionCanceled from './child-workflow-execution-canceled';
import ChildWorkflowExecutionCompleted from './child-workflow-execution-completed';
import ChildWorkflowExecutionFailed from './child-workflow-execution-failed';
import ChildWorkflowExecutionStarted from './child-workflow-execution-started';
import ChildWorkflowExecutionTerminated from './child-workflow-execution-terminated';
import ChildWorkflowExecutionTimedOut from './child-workflow-execution-timed-out';
import DecisionTaskCompleted from './decision-task-completed';
import DecisionTaskFailed from './decision-task-failed';
import DecisionTaskStarted from './decision-task-started';
import DecisionTaskTimedOut from './decision-task-timed-out';
import ExternalWorkflowExecutionCancelRequested from './external-workflow-execution-cancel-requested';
import ExternalWorkflowExecutionSignaled from './external-workflow-execution-signaled';
import MarkerRecorded from './marker-recorded';
import RequestCancelActivityTaskFailed from './request-cancel-activity-task-failed';
import RequestCancelExternalWorkflowExecutionFailed from './request-cancel-external-workflow-execution-failed';
import RequestCancelExternalWorkflowExecutionInitiated from './request-cancel-external-workflow-execution-initiated';
import SignalExternalWorkflowExecutionFailed from './signal-external-workflow-execution-failed';
import SignalExternalWorkflowExecutionInitiated from './signal-external-workflow-execution-initiated';
import StartChildWorkflowExecutionFailed from './start-child-workflow-execution-failed';
import StartChildWorkflowExecutionInitiated from './start-child-workflow-execution-initiated';
import TimerCanceled from './timer-canceled';
import TimerFired from './timer-fired';
import TimerStarted from './timer-started';
import UpsertWorkflowSearchAttributes from './upsert-workflow-search-attributes';
import WorkflowExecutionCancelRequested from './workflow-execution-cancel-requested';
import WorkflowExecutionCanceled from './workflow-execution-canceled';
import WorkflowExecutionCompleted from './workflow-execution-completed';
import WorkflowExecutionContinuedAsNew from './workflow-execution-continued-as-new';
import WorkflowExecutionFailed from './workflow-execution-failed';
import WorkflowExecutionSignaled from './workflow-execution-signaled';
import WorkflowExecutionStarted from './workflow-execution-started';
import WorkflowExecutionTimedOut from './workflow-execution-timed-out';

const eventTypeMap = {
  ActivityTaskCancelRequested,
  ActivityTaskCanceled,
  ActivityTaskCompleted,
  ActivityTaskFailed,
  ActivityTaskScheduled,
  ActivityTaskStarted,
  ActivityTaskTimedOut,
  CancelTimerFailed,
  ChildWorkflowExecutionCanceled,
  ChildWorkflowExecutionCompleted,
  ChildWorkflowExecutionFailed,
  ChildWorkflowExecutionStarted,
  ChildWorkflowExecutionTerminated,
  ChildWorkflowExecutionTimedOut,
  DecisionTaskCompleted,
  DecisionTaskFailed,
  DecisionTaskScheduled: () => ({}),
  DecisionTaskStarted,
  DecisionTaskTimedOut,
  ExternalWorkflowExecutionCancelRequested,
  ExternalWorkflowExecutionSignaled,
  MarkerRecorded,
  RequestCancelActivityTaskFailed,
  RequestCancelExternalWorkflowExecutionFailed,
  RequestCancelExternalWorkflowExecutionInitiated,
  SignalExternalWorkflowExecutionFailed,
  SignalExternalWorkflowExecutionInitiated,
  StartChildWorkflowExecutionFailed,
  StartChildWorkflowExecutionInitiated,
  TimerCanceled,
  TimerFired,
  TimerStarted,
  UpsertWorkflowSearchAttributes,
  WorkflowExecutionCancelRequested,
  WorkflowExecutionCanceled,
  WorkflowExecutionCompleted,
  WorkflowExecutionContinuedAsNew,
  WorkflowExecutionFailed,
  WorkflowExecutionSignaled,
  WorkflowExecutionStarted,
  WorkflowExecutionTerminated: () => ({}),
  WorkflowExecutionTimedOut,
};

const getEventConnections = (event, workflow) =>
  eventTypeMap[event.eventType](event, workflow);

export default getEventConnections;
