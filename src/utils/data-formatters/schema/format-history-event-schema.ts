import { type z } from 'zod';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import formatActivityTaskCancelRequestedEvent from '../format-workflow-history-event/format-activity-task-cancel-requested-event';
import formatActivityTaskCanceledEvent from '../format-workflow-history-event/format-activity-task-canceled-event';
import formatActivityTaskCompletedEvent from '../format-workflow-history-event/format-activity-task-completed-event';
import formatActivityTaskFailedEvent from '../format-workflow-history-event/format-activity-task-failed-event';
import formatActivityTaskScheduledEvent from '../format-workflow-history-event/format-activity-task-scheduled-event';
import formatActivityTaskStartedEvent from '../format-workflow-history-event/format-activity-task-started-event';
import formatActivityTaskTimedOutEvent from '../format-workflow-history-event/format-activity-task-timed-out-event';
import formatCancelTimerFailedEvent from '../format-workflow-history-event/format-cancel-timer-failed-event';
import formatChildWorkflowExecutionCanceledEvent from '../format-workflow-history-event/format-child-workflow-execution-canceled-event';
import formatChildWorkflowExecutionTerminatedEvent from '../format-workflow-history-event/format-child-workflow-execution-canceled-terminated';
import formatChildWorkflowExecutionCompletedEvent from '../format-workflow-history-event/format-child-workflow-execution-completed-event';
import formatChildWorkflowExecutionFailedEvent from '../format-workflow-history-event/format-child-workflow-execution-failed-event';
import formatChildWorkflowExecutionStartedEvent from '../format-workflow-history-event/format-child-workflow-execution-started-event';
import formatChildWorkflowExecutionTimedOutEvent from '../format-workflow-history-event/format-child-workflow-execution-timed-out-event';
import formatDecisionTaskCompletedEvent from '../format-workflow-history-event/format-decision-task-completed-event';
import formatDecisionTaskFailedEvent from '../format-workflow-history-event/format-decision-task-failed-event';
import formatDecisionTaskStartedEvent from '../format-workflow-history-event/format-decision-task-scheduled-event';
import formatDecisionTaskScheduledEvent from '../format-workflow-history-event/format-decision-task-started-event';
import formatDecisionTaskTimedOutEvent from '../format-workflow-history-event/format-decision-timed-out-event';
import formatExternalWorkflowExecutionCancelRequestedEvent from '../format-workflow-history-event/format-external-workflow-execution-cancel-requested-event';
import formatExternalWorkflowExecutionSignaledEvent from '../format-workflow-history-event/format-external-workflow-execution-signaled-event';
import formatMarkerRecordedEvent from '../format-workflow-history-event/format-format-marker-recorded-event';
import formatRequestCancelActivityTaskFailedEvent from '../format-workflow-history-event/format-request-cancel-activity-task-failed-event';
import formatRequestCancelExternalWorkflowExecutionFailedEvent from '../format-workflow-history-event/format-request-cancel-external-workflow-execution-failed-event';
import formatRequestCancelExternalWorkflowExecutionInitiatedEvent from '../format-workflow-history-event/format-request-cancel-external-workflow-execution-initiated-event';
import formatSignalExternalWorkflowExecutionFailedEvent from '../format-workflow-history-event/format-signal-external-workflow-execution-failed-event';
import formatSignalExternalWorkflowExecutionInitiatedEvent from '../format-workflow-history-event/format-signal-external-workflow-execution-initiated-event';
import formatStartChildWorkflowExecutionFailedEvent from '../format-workflow-history-event/format-start-child-workflow-execution-failed-event';
import formatStartChildWorkflowExecutionInitiatedEvent from '../format-workflow-history-event/format-start-child-workflow-execution-initiated-event';
import formatTimerCanceledEvent from '../format-workflow-history-event/format-timer-canceled-event';
import formatTimerFiredEvent from '../format-workflow-history-event/format-timer-fired-event';
import formatTimerStartedEvent from '../format-workflow-history-event/format-timer-started-event';
import formatUpsertWorkflowSearchAttributesEvent from '../format-workflow-history-event/format-upsert-workflow-search-attributes-event';
import formatWorkflowExecutionCancelRequestedEvent from '../format-workflow-history-event/format-workflow-execution-cancel-requested-event';
import formatWorkflowExecutionCanceledEvent from '../format-workflow-history-event/format-workflow-execution-canceled-event';
import formatWorkflowExecutionCompletedEvent from '../format-workflow-history-event/format-workflow-execution-completed-event';
import formatWorkflowExecutionContinuedAsNewEvent from '../format-workflow-history-event/format-workflow-execution-continued-as-new-event';
import formatWorkflowExecutionFailedEvent from '../format-workflow-history-event/format-workflow-execution-failed-event';
import formatWorkflowExecutionSignaledEvent from '../format-workflow-history-event/format-workflow-execution-signaled-event';
import formatWorkflowExecutionStartedEvent from '../format-workflow-history-event/format-workflow-execution-started-event';
import formatWorkflowExecutionTerminatedEvent from '../format-workflow-history-event/format-workflow-execution-terminated-event';
import formatWorkflowExecutionTimedOutEvent from '../format-workflow-history-event/format-workflow-execution-timed-out-event';

import {
  activityTaskCancelRequestedEventSchema,
  activityTaskCanceledEventSchema,
  activityTaskCompletedEventSchema,
  activityTaskFailedEventSchema,
  activityTaskScheduledEventSchema,
  activityTaskStartedEventSchema,
  activityTaskTimedOutEventSchema,
  cancelTimerFailedEventSchema,
  childWorkflowExecutionCanceledEventSchema,
  childWorkflowExecutionCompletedEventSchema,
  childWorkflowExecutionFailedEventSchema,
  childWorkflowExecutionStartedEventSchema,
  childWorkflowExecutionTerminatedEventSchema,
  childWorkflowExecutionTimedOutEventSchema,
  decisionTaskCompletedEventSchema,
  decisionTaskFailedEventSchema,
  decisionTaskScheduledEventSchema,
  decisionTaskStartedEventSchema,
  decisionTaskTimedOutEventSchema,
  externalWorkflowExecutionCancelRequestedEventSchema,
  externalWorkflowExecutionSignaledEventSchema,
  markerRecordedEventSchema,
  requestCancelActivityTaskFailedEventSchema,
  requestCancelExternalWorkflowExecutionFailedEventSchema,
  requestCancelExternalWorkflowExecutionInitiatedEventSchema,
  signalExternalWorkflowExecutionFailedEventSchema,
  signalExternalWorkflowExecutionInitiatedEventSchema,
  startChildWorkflowExecutionFailedEventSchema,
  startChildWorkflowExecutionInitiatedEventSchema,
  timerCanceledEventSchema,
  timerFiredEventSchema,
  timerStartedEventSchema,
  upsertWorkflowSearchAttributesEventSchema,
  workflowExecutionCancelRequestedEventAttributesSchema,
  workflowExecutionCanceledEventSchema,
  workflowExecutionCompletedEventSchema,
  workflowExecutionContinuedAsNewEventSchema,
  workflowExecutionFailedEventSchema,
  workflowExecutionSignaledEventSchema,
  workflowExecutionStartedEventSchema,
  workflowExecutionTerminatedEventSchema,
  workflowExecutionTimedOutEventSchema,
} from './history-event-schema';

export const formatWorkflowExecutionStartedEventSchema =
  workflowExecutionStartedEventSchema.transform(
    formatWorkflowExecutionStartedEvent
  );

export const formatWorkflowExecutionCompletedEventSchema =
  workflowExecutionCompletedEventSchema.transform(
    formatWorkflowExecutionCompletedEvent
  );

export const formatWorkflowExecutionFailedEventSchema =
  workflowExecutionFailedEventSchema.transform(
    formatWorkflowExecutionFailedEvent
  );

export const formatWorkflowExecutionTimedOutEventSchema =
  workflowExecutionTimedOutEventSchema.transform(
    formatWorkflowExecutionTimedOutEvent
  );

export const formatWorkflowExecutionSignaledEventSchema =
  workflowExecutionSignaledEventSchema.transform(
    formatWorkflowExecutionSignaledEvent
  );

export const formatWorkflowExecutionTerminatedEventSchema =
  workflowExecutionTerminatedEventSchema.transform(
    formatWorkflowExecutionTerminatedEvent
  );

export const formatWorkflowExecutionCanceledEventSchema =
  workflowExecutionCanceledEventSchema.transform(
    formatWorkflowExecutionCanceledEvent
  );

export const formatWorkflowExecutionContinuedAsNewEventSchema =
  workflowExecutionContinuedAsNewEventSchema.transform(
    formatWorkflowExecutionContinuedAsNewEvent
  );
export const formatWorkflowExecutionCancelRequestedEventAttributesSchema =
  workflowExecutionCancelRequestedEventAttributesSchema.transform(
    formatWorkflowExecutionCancelRequestedEvent
  );

export const formatDecisionTaskScheduledEventSchema =
  decisionTaskScheduledEventSchema.transform(formatDecisionTaskScheduledEvent);

export const formatDecisionTaskStartedEventSchema =
  decisionTaskStartedEventSchema.transform(formatDecisionTaskStartedEvent);

export const formatDecisionTaskCompletedEventSchema =
  decisionTaskCompletedEventSchema.transform(formatDecisionTaskCompletedEvent);

export const formatDecisionTaskTimedOutEventSchema =
  decisionTaskTimedOutEventSchema.transform(formatDecisionTaskTimedOutEvent);

export const formatDecisionTaskFailedEventSchema =
  decisionTaskFailedEventSchema.transform(formatDecisionTaskFailedEvent);

export const formatActivityTaskScheduledEventSchema =
  activityTaskScheduledEventSchema.transform(formatActivityTaskScheduledEvent);

export const formatActivityTaskStartedEventSchema =
  activityTaskStartedEventSchema.transform(formatActivityTaskStartedEvent);

export const formatActivityTaskCompletedEventSchema =
  activityTaskCompletedEventSchema.transform(formatActivityTaskCompletedEvent);

export const formatActivityTaskFailedEventSchema =
  activityTaskFailedEventSchema.transform(formatActivityTaskFailedEvent);

export const formatActivityTaskTimedOutEventSchema =
  activityTaskTimedOutEventSchema.transform(formatActivityTaskTimedOutEvent);

export const formatRequestCancelActivityTaskFailedEventSchema =
  requestCancelActivityTaskFailedEventSchema.transform(
    formatRequestCancelActivityTaskFailedEvent
  );

export const formatActivityTaskCancelRequestedEventSchema =
  activityTaskCancelRequestedEventSchema.transform(
    formatActivityTaskCancelRequestedEvent
  );

export const formatActivityTaskCanceledEventSchema =
  activityTaskCanceledEventSchema.transform(formatActivityTaskCanceledEvent);

export const formatTimerStartedEventSchema = timerStartedEventSchema.transform(
  formatTimerStartedEvent
);

export const formatTimerFiredEventSchema = timerFiredEventSchema.transform(
  formatTimerFiredEvent
);

export const formatTimerCanceledEventSchema =
  timerCanceledEventSchema.transform(formatTimerCanceledEvent);

export const formatCancelTimerFailedEventSchema =
  cancelTimerFailedEventSchema.transform(formatCancelTimerFailedEvent);

export const formatMarkerRecordedEventSchema =
  markerRecordedEventSchema.transform(formatMarkerRecordedEvent);

export const formatExternalWorkflowExecutionCancelRequestedEventSchema =
  externalWorkflowExecutionCancelRequestedEventSchema.transform(
    formatExternalWorkflowExecutionCancelRequestedEvent
  );

export const formatExternalWorkflowExecutionSignaledEventSchema =
  externalWorkflowExecutionSignaledEventSchema.transform(
    formatExternalWorkflowExecutionSignaledEvent
  );

export const formatRequestCancelExternalWorkflowExecutionInitiatedEventSchema =
  requestCancelExternalWorkflowExecutionInitiatedEventSchema.transform(
    formatRequestCancelExternalWorkflowExecutionInitiatedEvent
  );

export const formatRequestCancelExternalWorkflowExecutionFailedEventSchema =
  requestCancelExternalWorkflowExecutionFailedEventSchema.transform(
    formatRequestCancelExternalWorkflowExecutionFailedEvent
  );

export const formatSignalExternalWorkflowExecutionInitiatedEventSchema =
  signalExternalWorkflowExecutionInitiatedEventSchema.transform(
    formatSignalExternalWorkflowExecutionInitiatedEvent
  );

export const formatSignalExternalWorkflowExecutionFailedEventSchema =
  signalExternalWorkflowExecutionFailedEventSchema.transform(
    formatSignalExternalWorkflowExecutionFailedEvent
  );

export const formatStartChildWorkflowExecutionInitiatedEventSchema =
  startChildWorkflowExecutionInitiatedEventSchema.transform(
    formatStartChildWorkflowExecutionInitiatedEvent
  );

export const formatStartChildWorkflowExecutionFailedEventSchema =
  startChildWorkflowExecutionFailedEventSchema.transform(
    formatStartChildWorkflowExecutionFailedEvent
  );

export const formatChildWorkflowExecutionStartedEventSchema =
  childWorkflowExecutionStartedEventSchema.transform(
    formatChildWorkflowExecutionStartedEvent
  );

export const formatChildWorkflowExecutionCompletedEventSchema =
  childWorkflowExecutionCompletedEventSchema.transform(
    formatChildWorkflowExecutionCompletedEvent
  );

export const formatChildWorkflowExecutionFailedEventSchema =
  childWorkflowExecutionFailedEventSchema.transform(
    formatChildWorkflowExecutionFailedEvent
  );

export const formatChildWorkflowExecutionCanceledEventSchema =
  childWorkflowExecutionCanceledEventSchema.transform(
    formatChildWorkflowExecutionCanceledEvent
  );

export const formatChildWorkflowExecutionTimedOutEventSchema =
  childWorkflowExecutionTimedOutEventSchema.transform(
    formatChildWorkflowExecutionTimedOutEvent
  );

export const formatChildWorkflowExecutionTerminatedEventSchema =
  childWorkflowExecutionTerminatedEventSchema.transform(
    formatChildWorkflowExecutionTerminatedEvent
  );

export const formatUpsertWorkflowSearchAttributesEventSchema =
  upsertWorkflowSearchAttributesEventSchema.transform(
    formatUpsertWorkflowSearchAttributesEvent
  );

function unExistingEventType(_: never) {
  return null;
}
export const getFormatHistoryEventSchema = function (event: HistoryEvent) {
  switch (event.attributes) {
    case 'workflowExecutionStartedEventAttributes':
      return formatWorkflowExecutionStartedEventSchema;
    case 'workflowExecutionCompletedEventAttributes':
      return formatWorkflowExecutionCompletedEventSchema;
    case 'workflowExecutionFailedEventAttributes':
      return formatWorkflowExecutionFailedEventSchema;
    case 'workflowExecutionTimedOutEventAttributes':
      return formatWorkflowExecutionTimedOutEventSchema;
    case 'workflowExecutionSignaledEventAttributes':
      return formatWorkflowExecutionSignaledEventSchema;
    case 'workflowExecutionTerminatedEventAttributes':
      return formatWorkflowExecutionTerminatedEventSchema;
    case 'workflowExecutionCanceledEventAttributes':
      return formatWorkflowExecutionCanceledEventSchema;
    case 'workflowExecutionContinuedAsNewEventAttributes':
      return formatWorkflowExecutionContinuedAsNewEventSchema;

    case 'workflowExecutionCancelRequestedEventAttributes':
      return formatWorkflowExecutionCancelRequestedEventAttributesSchema;

    case 'decisionTaskCompletedEventAttributes':
      return formatDecisionTaskCompletedEventSchema;
    case 'decisionTaskFailedEventAttributes':
      return formatDecisionTaskFailedEventSchema;
    case 'decisionTaskScheduledEventAttributes':
      return formatDecisionTaskScheduledEventSchema;
    case 'decisionTaskStartedEventAttributes':
      return formatDecisionTaskStartedEventSchema;
    case 'decisionTaskTimedOutEventAttributes':
      return formatDecisionTaskTimedOutEventSchema;

    case 'activityTaskCancelRequestedEventAttributes':
      return formatActivityTaskCancelRequestedEventSchema;
    case 'activityTaskCanceledEventAttributes':
      return formatActivityTaskCanceledEventSchema;
    case 'activityTaskCompletedEventAttributes':
      return formatActivityTaskCompletedEventSchema;
    case 'activityTaskFailedEventAttributes':
      return formatActivityTaskFailedEventSchema;
    case 'activityTaskScheduledEventAttributes':
      return formatActivityTaskScheduledEventSchema;
    case 'activityTaskStartedEventAttributes':
      return formatActivityTaskStartedEventSchema;
    case 'activityTaskTimedOutEventAttributes':
      return formatActivityTaskTimedOutEventSchema;
    case 'requestCancelActivityTaskFailedEventAttributes':
      return formatRequestCancelActivityTaskFailedEventSchema;

    case 'timerCanceledEventAttributes':
      return formatTimerCanceledEventSchema;
    case 'timerFiredEventAttributes':
      return formatTimerFiredEventSchema;
    case 'timerStartedEventAttributes':
      return formatTimerStartedEventSchema;
    case 'cancelTimerFailedEventAttributes':
      return formatCancelTimerFailedEventSchema;
    case 'markerRecordedEventAttributes':
      return formatMarkerRecordedEventSchema;

    case 'externalWorkflowExecutionCancelRequestedEventAttributes':
      return formatExternalWorkflowExecutionCancelRequestedEventSchema;
    case 'externalWorkflowExecutionSignaledEventAttributes':
      return formatExternalWorkflowExecutionSignaledEventSchema;

    case 'signalExternalWorkflowExecutionFailedEventAttributes':
      return formatSignalExternalWorkflowExecutionFailedEventSchema;

    case 'signalExternalWorkflowExecutionInitiatedEventAttributes':
      return formatSignalExternalWorkflowExecutionInitiatedEventSchema;

    case 'requestCancelExternalWorkflowExecutionFailedEventAttributes':
      return formatRequestCancelExternalWorkflowExecutionFailedEventSchema;

    case 'requestCancelExternalWorkflowExecutionInitiatedEventAttributes':
      return formatRequestCancelExternalWorkflowExecutionInitiatedEventSchema;

    case 'childWorkflowExecutionCanceledEventAttributes':
      return formatChildWorkflowExecutionCanceledEventSchema;

    case 'childWorkflowExecutionCompletedEventAttributes':
      return formatChildWorkflowExecutionCompletedEventSchema;

    case 'childWorkflowExecutionFailedEventAttributes':
      return formatChildWorkflowExecutionFailedEventSchema;

    case 'childWorkflowExecutionStartedEventAttributes':
      return formatChildWorkflowExecutionStartedEventSchema;

    case 'childWorkflowExecutionTerminatedEventAttributes':
      return formatChildWorkflowExecutionTerminatedEventSchema;

    case 'childWorkflowExecutionTimedOutEventAttributes':
      return formatChildWorkflowExecutionTimedOutEventSchema;

    case 'startChildWorkflowExecutionFailedEventAttributes':
      return formatStartChildWorkflowExecutionFailedEventSchema;

    case 'startChildWorkflowExecutionInitiatedEventAttributes':
      return formatStartChildWorkflowExecutionInitiatedEventSchema;

    case 'upsertWorkflowSearchAttributesEventAttributes':
      return formatUpsertWorkflowSearchAttributesEventSchema;

    default:
      return unExistingEventType(event.attributes); // should not be unreachable, used to show a type error if not all attributes cases are covered
  }
};

export type FormattedWorkflowExecutionStartedEvent = z.infer<
  typeof formatWorkflowExecutionStartedEventSchema
>;
export type FormattedWorkflowExecutionCompletedEvent = z.infer<
  typeof formatWorkflowExecutionCompletedEventSchema
>;
export type FormattedWorkflowExecutionFailedEvent = z.infer<
  typeof formatWorkflowExecutionFailedEventSchema
>;
export type FormattedWorkflowExecutionTimedOutEvent = z.infer<
  typeof formatWorkflowExecutionTimedOutEventSchema
>;
export type FormattedWorkflowExecutionSignaledEvent = z.infer<
  typeof formatWorkflowExecutionSignaledEventSchema
>;
export type FormattedWorkflowExecutionTerminatedEvent = z.infer<
  typeof formatWorkflowExecutionTerminatedEventSchema
>;
export type FormattedWorkflowExecutionCanceledEvent = z.infer<
  typeof formatWorkflowExecutionCanceledEventSchema
>;
export type FormattedWorkflowExecutionContinuedAsNewEvent = z.infer<
  typeof formatWorkflowExecutionContinuedAsNewEventSchema
>;
export type FormattedWorkflowExecutionCancelRequestedEventAttributesSchema =
  z.infer<typeof formatWorkflowExecutionCancelRequestedEventAttributesSchema>;
export type FormattedDecisionTaskCompletedEvent = z.infer<
  typeof formatDecisionTaskCompletedEventSchema
>;
export type FormattedDecisionTaskFailedEvent = z.infer<
  typeof formatDecisionTaskFailedEventSchema
>;
export type FormattedDecisionTaskScheduledEvent = z.infer<
  typeof formatDecisionTaskScheduledEventSchema
>;
export type FormattedDecisionTaskStartedEvent = z.infer<
  typeof formatDecisionTaskStartedEventSchema
>;
export type FormattedDecisionTaskTimedOutEvent = z.infer<
  typeof formatDecisionTaskTimedOutEventSchema
>;
export type FormattedActivityTaskCancelRequestedEvent = z.infer<
  typeof formatActivityTaskCancelRequestedEventSchema
>;
export type FormattedActivityTaskCanceledEvent = z.infer<
  typeof formatActivityTaskCanceledEventSchema
>;
export type FormattedActivityTaskCompletedEvent = z.infer<
  typeof formatActivityTaskCompletedEventSchema
>;
export type FormattedActivityTaskFailedEvent = z.infer<
  typeof formatActivityTaskFailedEventSchema
>;
export type FormattedActivityTaskScheduledEvent = z.infer<
  typeof formatActivityTaskScheduledEventSchema
>;
export type FormattedActivityTaskStartedEvent = z.infer<
  typeof formatActivityTaskStartedEventSchema
>;
export type FormattedActivityTaskTimedOutEvent = z.infer<
  typeof formatActivityTaskTimedOutEventSchema
>;
export type FormattedRequestCancelActivityTaskFailedEvent = z.infer<
  typeof formatRequestCancelActivityTaskFailedEventSchema
>;
export type FormattedTimerCanceledEvent = z.infer<
  typeof formatTimerCanceledEventSchema
>;
export type FormattedTimerFiredEvent = z.infer<
  typeof formatTimerFiredEventSchema
>;
export type FormattedTimerStartedEvent = z.infer<
  typeof formatTimerStartedEventSchema
>;
export type FormattedCancelTimerFailedEvent = z.infer<
  typeof formatCancelTimerFailedEventSchema
>;
export type FormattedMarkerRecordedEvent = z.infer<
  typeof formatMarkerRecordedEventSchema
>;
export type FormattedExternalWorkflowExecutionCancelRequestedEvent = z.infer<
  typeof formatExternalWorkflowExecutionCancelRequestedEventSchema
>;
export type FormattedExternalWorkflowExecutionSignaledEvent = z.infer<
  typeof formatExternalWorkflowExecutionSignaledEventSchema
>;
export type FormattedSignalExternalWorkflowExecutionFailedEvent = z.infer<
  typeof formatSignalExternalWorkflowExecutionFailedEventSchema
>;
export type FormattedSignalExternalWorkflowExecutionInitiatedEvent = z.infer<
  typeof formatSignalExternalWorkflowExecutionInitiatedEventSchema
>;
export type FormattedRequestCancelExternalWorkflowExecutionFailedEvent =
  z.infer<typeof formatRequestCancelExternalWorkflowExecutionFailedEventSchema>;
export type FormattedRequestCancelExternalWorkflowExecutionInitiatedEvent =
  z.infer<
    typeof formatRequestCancelExternalWorkflowExecutionInitiatedEventSchema
  >;
export type FormattedChildWorkflowExecutionCanceledEvent = z.infer<
  typeof formatChildWorkflowExecutionCanceledEventSchema
>;
export type FormattedChildWorkflowExecutionCompletedEvent = z.infer<
  typeof formatChildWorkflowExecutionCompletedEventSchema
>;
export type FormattedChildWorkflowExecutionFailedEvent = z.infer<
  typeof formatChildWorkflowExecutionFailedEventSchema
>;
export type FormattedChildWorkflowExecutionStartedEvent = z.infer<
  typeof formatChildWorkflowExecutionStartedEventSchema
>;
export type FormattedChildWorkflowExecutionTerminatedEvent = z.infer<
  typeof formatChildWorkflowExecutionTerminatedEventSchema
>;
export type FormattedChildWorkflowExecutionTimedOutEvent = z.infer<
  typeof formatChildWorkflowExecutionTimedOutEventSchema
>;
export type FormattedStartChildWorkflowExecutionFailedEvent = z.infer<
  typeof formatStartChildWorkflowExecutionFailedEventSchema
>;
export type FormattedStartChildWorkflowExecutionInitiatedEvent = z.infer<
  typeof formatStartChildWorkflowExecutionInitiatedEventSchema
>;
export type FormattedUpsertWorkflowSearchAttributesEvent = z.infer<
  typeof formatUpsertWorkflowSearchAttributesEventSchema
>;

export type FormattedHistoryEvent =
  | FormattedWorkflowExecutionStartedEvent
  | FormattedWorkflowExecutionCompletedEvent
  | FormattedWorkflowExecutionFailedEvent
  | FormattedWorkflowExecutionTimedOutEvent
  | FormattedWorkflowExecutionSignaledEvent
  | FormattedWorkflowExecutionTerminatedEvent
  | FormattedWorkflowExecutionCanceledEvent
  | FormattedWorkflowExecutionContinuedAsNewEvent
  | FormattedWorkflowExecutionCancelRequestedEventAttributesSchema
  | FormattedDecisionTaskCompletedEvent
  | FormattedDecisionTaskFailedEvent
  | FormattedDecisionTaskScheduledEvent
  | FormattedDecisionTaskStartedEvent
  | FormattedDecisionTaskTimedOutEvent
  | FormattedActivityTaskCancelRequestedEvent
  | FormattedActivityTaskCanceledEvent
  | FormattedActivityTaskCompletedEvent
  | FormattedActivityTaskFailedEvent
  | FormattedActivityTaskScheduledEvent
  | FormattedActivityTaskStartedEvent
  | FormattedActivityTaskTimedOutEvent
  | FormattedRequestCancelActivityTaskFailedEvent
  | FormattedTimerCanceledEvent
  | FormattedTimerFiredEvent
  | FormattedTimerStartedEvent
  | FormattedCancelTimerFailedEvent
  | FormattedMarkerRecordedEvent
  | FormattedExternalWorkflowExecutionCancelRequestedEvent
  | FormattedExternalWorkflowExecutionSignaledEvent
  | FormattedSignalExternalWorkflowExecutionFailedEvent
  | FormattedSignalExternalWorkflowExecutionInitiatedEvent
  | FormattedRequestCancelExternalWorkflowExecutionFailedEvent
  | FormattedRequestCancelExternalWorkflowExecutionInitiatedEvent
  | FormattedChildWorkflowExecutionCanceledEvent
  | FormattedChildWorkflowExecutionCompletedEvent
  | FormattedChildWorkflowExecutionFailedEvent
  | FormattedChildWorkflowExecutionStartedEvent
  | FormattedChildWorkflowExecutionTerminatedEvent
  | FormattedChildWorkflowExecutionTimedOutEvent
  | FormattedStartChildWorkflowExecutionFailedEvent
  | FormattedStartChildWorkflowExecutionInitiatedEvent
  | FormattedUpsertWorkflowSearchAttributesEvent;
