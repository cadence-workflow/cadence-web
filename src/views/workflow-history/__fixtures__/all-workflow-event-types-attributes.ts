import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import { type ExtendedHistoryEvent } from '../workflow-history.types';

// validates that each all attributes exists in the provided array
const arrayOfAllAttrs = <T extends HistoryEvent['attributes'][]>(
  array: T &
    ([HistoryEvent['attributes']] extends [T[number]] ? unknown : 'Invalid')
) => array;

// validates that each all attributes exists in the provided array
const arrayOfAllAttrsExtended = <
  T extends ExtendedHistoryEvent['attributes'][],
>(
  array: T &
    ([ExtendedHistoryEvent['attributes']] extends [T[number]]
      ? unknown
      : 'Invalid')
) => array;

const allAttrsArr = arrayOfAllAttrs([
  'activityTaskScheduledEventAttributes',
  'activityTaskStartedEventAttributes',
  'activityTaskCompletedEventAttributes',
  'activityTaskFailedEventAttributes',
  'activityTaskTimedOutEventAttributes',
  'activityTaskCanceledEventAttributes',
  'decisionTaskScheduledEventAttributes',
  'decisionTaskStartedEventAttributes',
  'decisionTaskCompletedEventAttributes',
  'decisionTaskFailedEventAttributes',
  'decisionTaskTimedOutEventAttributes',
  'timerStartedEventAttributes',
  'timerFiredEventAttributes',
  'timerCanceledEventAttributes',
  'startChildWorkflowExecutionInitiatedEventAttributes',
  'startChildWorkflowExecutionFailedEventAttributes',
  'childWorkflowExecutionStartedEventAttributes',
  'childWorkflowExecutionCompletedEventAttributes',
  'childWorkflowExecutionFailedEventAttributes',
  'childWorkflowExecutionCanceledEventAttributes',
  'childWorkflowExecutionTimedOutEventAttributes',
  'childWorkflowExecutionTerminatedEventAttributes',
  'signalExternalWorkflowExecutionInitiatedEventAttributes',
  'signalExternalWorkflowExecutionFailedEventAttributes',
  'externalWorkflowExecutionSignaledEventAttributes',
  'requestCancelExternalWorkflowExecutionInitiatedEventAttributes',
  'requestCancelExternalWorkflowExecutionFailedEventAttributes',
  'externalWorkflowExecutionCancelRequestedEventAttributes',
  'workflowExecutionStartedEventAttributes',
  'workflowExecutionCompletedEventAttributes',
  'workflowExecutionFailedEventAttributes',
  'workflowExecutionTimedOutEventAttributes',
  'activityTaskCancelRequestedEventAttributes',
  'requestCancelActivityTaskFailedEventAttributes',
  'cancelTimerFailedEventAttributes',
  'markerRecordedEventAttributes',
  'workflowExecutionSignaledEventAttributes',
  'workflowExecutionTerminatedEventAttributes',
  'workflowExecutionCancelRequestedEventAttributes',
  'workflowExecutionCanceledEventAttributes',
  'workflowExecutionContinuedAsNewEventAttributes',
  'upsertWorkflowSearchAttributesEventAttributes',
]);

const allAttrsArrExtended = arrayOfAllAttrsExtended([
  ...allAttrsArr,
  'pendingActivityTaskStartEventAttributes',
  'pendingDecisionTaskScheduleEventAttributes',
]);

export const allWorkflowEventTypesAttrs: Pick<HistoryEvent, 'attributes'>[] =
  allAttrsArr.map((v) => ({ attributes: v }));

export const allWorkflowEventTypesAttrsExtended: Pick<
  ExtendedHistoryEvent,
  'attributes'
>[] = allAttrsArrExtended.map((v) => ({ attributes: v }));
