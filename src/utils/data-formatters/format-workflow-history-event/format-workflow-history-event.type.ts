import { type ActivityTaskCancelRequestedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActivityTaskCancelRequestedEventAttributes';
import { type ActivityTaskCanceledEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActivityTaskCanceledEventAttributes';
import { type ActivityTaskCompletedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActivityTaskCompletedEventAttributes';
import { type ActivityTaskFailedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActivityTaskFailedEventAttributes';
import { type ActivityTaskScheduledEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActivityTaskScheduledEventAttributes';
import { type ActivityTaskStartedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActivityTaskStartedEventAttributes';
import { type ActivityTaskTimedOutEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActivityTaskTimedOutEventAttributes';
import { type CancelTimerFailedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/CancelTimerFailedEventAttributes';
import { type ChildWorkflowExecutionCanceledEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ChildWorkflowExecutionCanceledEventAttributes';
import { type ChildWorkflowExecutionCompletedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ChildWorkflowExecutionCompletedEventAttributes';
import { type ChildWorkflowExecutionFailedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ChildWorkflowExecutionFailedEventAttributes';
import { type ChildWorkflowExecutionStartedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ChildWorkflowExecutionStartedEventAttributes';
import { type ChildWorkflowExecutionTerminatedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ChildWorkflowExecutionTerminatedEventAttributes';
import { type ChildWorkflowExecutionTimedOutEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ChildWorkflowExecutionTimedOutEventAttributes';
import { type DecisionTaskCompletedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/DecisionTaskCompletedEventAttributes';
import { type DecisionTaskFailedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/DecisionTaskFailedEventAttributes';
import { type DecisionTaskScheduledEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/DecisionTaskScheduledEventAttributes';
import { type DecisionTaskStartedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/DecisionTaskStartedEventAttributes';
import { type DecisionTaskTimedOutEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/DecisionTaskTimedOutEventAttributes';
import { type ExternalWorkflowExecutionCancelRequestedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ExternalWorkflowExecutionCancelRequestedEventAttributes';
import { type ExternalWorkflowExecutionSignaledEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/ExternalWorkflowExecutionSignaledEventAttributes';
import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { type MarkerRecordedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/MarkerRecordedEventAttributes';
import { type RequestCancelActivityTaskFailedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/RequestCancelActivityTaskFailedEventAttributes';
import { type RequestCancelExternalWorkflowExecutionFailedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/RequestCancelExternalWorkflowExecutionFailedEventAttributes';
import { type RequestCancelExternalWorkflowExecutionInitiatedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/RequestCancelExternalWorkflowExecutionInitiatedEventAttributes';
import { type SignalExternalWorkflowExecutionFailedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/SignalExternalWorkflowExecutionFailedEventAttributes';
import { type SignalExternalWorkflowExecutionInitiatedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/SignalExternalWorkflowExecutionInitiatedEventAttributes';
import { type StartChildWorkflowExecutionFailedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/StartChildWorkflowExecutionFailedEventAttributes';
import { type StartChildWorkflowExecutionInitiatedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/StartChildWorkflowExecutionInitiatedEventAttributes';
import { type TimerCanceledEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/TimerCanceledEventAttributes';
import { type TimerFiredEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/TimerFiredEventAttributes';
import { type TimerStartedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/TimerStartedEventAttributes';
import { type UpsertWorkflowSearchAttributesEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/UpsertWorkflowSearchAttributesEventAttributes';
import { type WorkflowExecutionCancelRequestedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCancelRequestedEventAttributes';
import { type WorkflowExecutionCanceledEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCanceledEventAttributes';
import { type WorkflowExecutionCompletedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCompletedEventAttributes';
import { type WorkflowExecutionContinuedAsNewEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionContinuedAsNewEventAttributes';
import { type WorkflowExecutionFailedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionFailedEventAttributes';
import { type WorkflowExecutionSignaledEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionSignaledEventAttributes';
import { type WorkflowExecutionStartedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionStartedEventAttributes';
import { type WorkflowExecutionTerminatedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionTerminatedEventAttributes';
import { type WorkflowExecutionTimedOutEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionTimedOutEventAttributes';

export type WorkflowExecutionStartedEvent = HistoryEvent & {
  attributes: 'workflowExecutionStartedEventAttributes';
  workflowExecutionStartedEventAttributes: WorkflowExecutionStartedEventAttributes;
};

export type WorkflowExecutionCompletedEvent = HistoryEvent & {
  attributes: 'workflowExecutionCompletedEventAttributes';
  workflowExecutionCompletedEventAttributes: WorkflowExecutionCompletedEventAttributes;
};

export type WorkflowExecutionCanceledEvent = HistoryEvent & {
  attributes: 'workflowExecutionCanceledEventAttributes';
  workflowExecutionCanceledEventAttributes: WorkflowExecutionCanceledEventAttributes;
};

export type WorkflowExecutionFailedEvent = HistoryEvent & {
  attributes: 'workflowExecutionFailedEventAttributes';
  workflowExecutionFailedEventAttributes: WorkflowExecutionFailedEventAttributes;
};

export type WorkflowExecutionTimedOutEvent = HistoryEvent & {
  attributes: 'workflowExecutionTimedOutEventAttributes';
  workflowExecutionTimedOutEventAttributes: WorkflowExecutionTimedOutEventAttributes;
};

export type DecisionTaskScheduledEvent = HistoryEvent & {
  attributes: 'decisionTaskScheduledEventAttributes';
  decisionTaskScheduledEventAttributes: DecisionTaskScheduledEventAttributes;
};

export type DecisionTaskStartedEvent = HistoryEvent & {
  attributes: 'decisionTaskStartedEventAttributes';
  decisionTaskStartedEventAttributes: DecisionTaskStartedEventAttributes;
};

export type DecisionTaskCompletedEvent = HistoryEvent & {
  attributes: 'decisionTaskCompletedEventAttributes';
  decisionTaskCompletedEventAttributes: DecisionTaskCompletedEventAttributes;
};

export type DecisionTaskTimedOutEvent = HistoryEvent & {
  attributes: 'decisionTaskTimedOutEventAttributes';
  decisionTaskTimedOutEventAttributes: DecisionTaskTimedOutEventAttributes;
};

export type DecisionTaskFailedEvent = HistoryEvent & {
  attributes: 'decisionTaskFailedEventAttributes';
  decisionTaskFailedEventAttributes: DecisionTaskFailedEventAttributes;
};

export type ActivityTaskScheduledEvent = HistoryEvent & {
  attributes: 'activityTaskScheduledEventAttributes';
  activityTaskScheduledEventAttributes: ActivityTaskScheduledEventAttributes;
};

export type ActivityTaskStartedEvent = HistoryEvent & {
  attributes: 'activityTaskStartedEventAttributes';
  activityTaskStartedEventAttributes: ActivityTaskStartedEventAttributes;
};

export type ActivityTaskCompletedEvent = HistoryEvent & {
  attributes: 'activityTaskCompletedEventAttributes';
  activityTaskCompletedEventAttributes: ActivityTaskCompletedEventAttributes;
};

export type ActivityTaskFailedEvent = HistoryEvent & {
  attributes: 'activityTaskFailedEventAttributes';
  activityTaskFailedEventAttributes: ActivityTaskFailedEventAttributes;
};

export type ActivityTaskTimedOutEvent = HistoryEvent & {
  attributes: 'activityTaskTimedOutEventAttributes';
  activityTaskTimedOutEventAttributes: ActivityTaskTimedOutEventAttributes;
};

export type TimerStartedEvent = HistoryEvent & {
  attributes: 'timerStartedEventAttributes';
  timerStartedEventAttributes: TimerStartedEventAttributes;
};

export type TimerFiredEvent = HistoryEvent & {
  attributes: 'timerFiredEventAttributes';
  timerFiredEventAttributes: TimerFiredEventAttributes;
};

export type ActivityTaskCancelRequestedEvent = HistoryEvent & {
  attributes: 'activityTaskCancelRequestedEventAttributes';
  activityTaskCancelRequestedEventAttributes: ActivityTaskCancelRequestedEventAttributes;
};

export type RequestCancelActivityTaskFailedEvent = HistoryEvent & {
  attributes: 'requestCancelActivityTaskFailedEventAttributes';
  requestCancelActivityTaskFailedEventAttributes: RequestCancelActivityTaskFailedEventAttributes;
};

export type ActivityTaskCanceledEvent = HistoryEvent & {
  attributes: 'activityTaskCanceledEventAttributes';
  activityTaskCanceledEventAttributes: ActivityTaskCanceledEventAttributes;
};

export type TimerCanceledEvent = HistoryEvent & {
  attributes: 'timerCanceledEventAttributes';
  timerCanceledEventAttributes: TimerCanceledEventAttributes;
};

export type CancelTimerFailedEvent = HistoryEvent & {
  attributes: 'cancelTimerFailedEventAttributes';
  cancelTimerFailedEventAttributes: CancelTimerFailedEventAttributes;
};

export type MarkerRecordedEvent = HistoryEvent & {
  attributes: 'markerRecordedEventAttributes';
  markerRecordedEventAttributes: MarkerRecordedEventAttributes;
};

export type WorkflowExecutionSignaledEvent = HistoryEvent & {
  attributes: 'workflowExecutionSignaledEventAttributes';
  workflowExecutionSignaledEventAttributes: WorkflowExecutionSignaledEventAttributes;
};

export type WorkflowExecutionTerminatedEvent = HistoryEvent & {
  attributes: 'workflowExecutionTerminatedEventAttributes';
  workflowExecutionTerminatedEventAttributes: WorkflowExecutionTerminatedEventAttributes;
};

export type WorkflowExecutionCancelRequestedEvent = HistoryEvent & {
  attributes: 'workflowExecutionCancelRequestedEventAttributes';
  workflowExecutionCancelRequestedEventAttributes: WorkflowExecutionCancelRequestedEventAttributes;
};

export type RequestCancelExternalWorkflowExecutionInitiatedEvent =
  HistoryEvent & {
    attributes: 'requestCancelExternalWorkflowExecutionInitiatedEventAttributes';
    requestCancelExternalWorkflowExecutionInitiatedEventAttributes: RequestCancelExternalWorkflowExecutionInitiatedEventAttributes;
  };

export type RequestCancelExternalWorkflowExecutionFailedEvent = HistoryEvent & {
  attributes: 'requestCancelExternalWorkflowExecutionFailedEventAttributes';
  requestCancelExternalWorkflowExecutionFailedEventAttributes: RequestCancelExternalWorkflowExecutionFailedEventAttributes;
};

export type ExternalWorkflowExecutionCancelRequestedEvent = HistoryEvent & {
  attributes: 'externalWorkflowExecutionCancelRequestedEventAttributes';
  externalWorkflowExecutionCancelRequestedEventAttributes: ExternalWorkflowExecutionCancelRequestedEventAttributes;
};

export type WorkflowExecutionContinuedAsNewEvent = HistoryEvent & {
  attributes: 'workflowExecutionContinuedAsNewEventAttributes';
  workflowExecutionContinuedAsNewEventAttributes: WorkflowExecutionContinuedAsNewEventAttributes;
};

export type StartChildWorkflowExecutionInitiatedEvent = HistoryEvent & {
  attributes: 'startChildWorkflowExecutionInitiatedEventAttributes';
  startChildWorkflowExecutionInitiatedEventAttributes: StartChildWorkflowExecutionInitiatedEventAttributes;
};

export type StartChildWorkflowExecutionFailedEvent = HistoryEvent & {
  attributes: 'startChildWorkflowExecutionFailedEventAttributes';
  startChildWorkflowExecutionFailedEventAttributes: StartChildWorkflowExecutionFailedEventAttributes;
};

export type ChildWorkflowExecutionStartedEvent = HistoryEvent & {
  attributes: 'childWorkflowExecutionStartedEventAttributes';
  childWorkflowExecutionStartedEventAttributes: ChildWorkflowExecutionStartedEventAttributes;
};

export type ChildWorkflowExecutionCompletedEvent = HistoryEvent & {
  attributes: 'childWorkflowExecutionCompletedEventAttributes';
  childWorkflowExecutionCompletedEventAttributes: ChildWorkflowExecutionCompletedEventAttributes;
};

export type ChildWorkflowExecutionFailedEvent = HistoryEvent & {
  attributes: 'childWorkflowExecutionFailedEventAttributes';
  childWorkflowExecutionFailedEventAttributes: ChildWorkflowExecutionFailedEventAttributes;
};

export type ChildWorkflowExecutionCanceledEvent = HistoryEvent & {
  attributes: 'childWorkflowExecutionCanceledEventAttributes';
  childWorkflowExecutionCanceledEventAttributes: ChildWorkflowExecutionCanceledEventAttributes;
};

export type ChildWorkflowExecutionTimedOutEvent = HistoryEvent & {
  attributes: 'childWorkflowExecutionTimedOutEventAttributes';
  childWorkflowExecutionTimedOutEventAttributes: ChildWorkflowExecutionTimedOutEventAttributes;
};

export type ChildWorkflowExecutionTerminatedEvent = HistoryEvent & {
  attributes: 'childWorkflowExecutionTerminatedEventAttributes';
  childWorkflowExecutionTerminatedEventAttributes: ChildWorkflowExecutionTerminatedEventAttributes;
};

export type SignalExternalWorkflowExecutionInitiatedEvent = HistoryEvent & {
  attributes: 'signalExternalWorkflowExecutionInitiatedEventAttributes';
  signalExternalWorkflowExecutionInitiatedEventAttributes: SignalExternalWorkflowExecutionInitiatedEventAttributes;
};

export type SignalExternalWorkflowExecutionFailedEvent = HistoryEvent & {
  attributes: 'signalExternalWorkflowExecutionFailedEventAttributes';
  signalExternalWorkflowExecutionFailedEventAttributes: SignalExternalWorkflowExecutionFailedEventAttributes;
};

export type ExternalWorkflowExecutionSignaledEvent = HistoryEvent & {
  attributes: 'externalWorkflowExecutionSignaledEventAttributes';
  externalWorkflowExecutionSignaledEventAttributes: ExternalWorkflowExecutionSignaledEventAttributes;
};

export type UpsertWorkflowSearchAttributesEvent = HistoryEvent & {
  attributes: 'upsertWorkflowSearchAttributesEventAttributes';
  upsertWorkflowSearchAttributesEventAttributes: UpsertWorkflowSearchAttributesEventAttributes;
};
