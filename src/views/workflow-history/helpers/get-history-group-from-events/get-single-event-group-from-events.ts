import type {
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  SingleEventHistoryGroup,
  SingleHistoryEvent,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getSingleEventGroupFromEvents(
  events: SingleHistoryEvent[]
): SingleEventHistoryGroup {
  const event = events[0];
  const eventToGroupLabel: Record<SingleHistoryEvent['attributes'], string> = {
    activityTaskCancelRequestedEventAttributes: `Activity ${event.activityTaskCancelRequestedEventAttributes?.activityId}: Cancel Request`,
    requestCancelActivityTaskFailedEventAttributes: `Activity ${event.requestCancelActivityTaskFailedEventAttributes?.activityId}: Cancel Request Failed`,
    cancelTimerFailedEventAttributes: `Timer ${event.cancelTimerFailedEventAttributes?.timerId}: Cancellation Failed`,
    markerRecordedEventAttributes: 'Version Marker',
    upsertWorkflowSearchAttributesEventAttributes: 'Workflow Search Attributes',
    workflowExecutionStartedEventAttributes: 'Workflow Started',
    workflowExecutionCompletedEventAttributes: 'Workflow Completed',
    workflowExecutionFailedEventAttributes: 'Workflow Failed',
    workflowExecutionTimedOutEventAttributes: 'Workflow Timed out',
    workflowExecutionSignaledEventAttributes: 'Workflow Signaled',
    workflowExecutionTerminatedEventAttributes: 'Workflow Terminated',
    workflowExecutionCancelRequestedEventAttributes: 'Workflow Cancel Request',
    workflowExecutionCanceledEventAttributes: 'Workflow Canceled',
    workflowExecutionContinuedAsNewEventAttributes: 'Workflow Continued As New',
  };

  const label = eventToGroupLabel[event.attributes];
  const groupType = 'Event';
  const hasMissingEvents = false;

  const eventToLabel: HistoryGroupEventToStringMap<SingleEventHistoryGroup> = {
    activityTaskCancelRequestedEventAttributes: 'Requested',
    requestCancelActivityTaskFailedEventAttributes: 'Failed',
    cancelTimerFailedEventAttributes: 'Failed',
    markerRecordedEventAttributes: 'Recorded',
    upsertWorkflowSearchAttributesEventAttributes: 'Upserted',
    workflowExecutionStartedEventAttributes: 'Started',
    workflowExecutionCompletedEventAttributes: 'Completed',
    workflowExecutionFailedEventAttributes: 'Failed',
    workflowExecutionTimedOutEventAttributes: 'Timed out',
    workflowExecutionSignaledEventAttributes: 'Signaled',
    workflowExecutionTerminatedEventAttributes: 'Terminated',
    workflowExecutionCancelRequestedEventAttributes: 'Requested',
    workflowExecutionCanceledEventAttributes: 'Canceled',
    workflowExecutionContinuedAsNewEventAttributes: 'Continued as new',
  };

  const eventToStatus: HistoryGroupEventToStatusMap<SingleEventHistoryGroup> = {
    activityTaskCancelRequestedEventAttributes: 'COMPLETED',
    requestCancelActivityTaskFailedEventAttributes: 'FAILED',
    cancelTimerFailedEventAttributes: 'FAILED',
    markerRecordedEventAttributes: 'COMPLETED',
    upsertWorkflowSearchAttributesEventAttributes: 'COMPLETED',
    workflowExecutionStartedEventAttributes: 'COMPLETED',
    workflowExecutionCompletedEventAttributes: 'COMPLETED',
    workflowExecutionFailedEventAttributes: 'FAILED',
    workflowExecutionTimedOutEventAttributes: 'FAILED',
    workflowExecutionSignaledEventAttributes: 'COMPLETED',
    workflowExecutionTerminatedEventAttributes: 'FAILED',
    workflowExecutionCancelRequestedEventAttributes: 'COMPLETED',
    workflowExecutionCanceledEventAttributes: 'CANCELED',
    workflowExecutionContinuedAsNewEventAttributes: 'COMPLETED',
  };

  return {
    label,
    hasMissingEvents,
    groupType,
    ...getCommonHistoryGroupFields<SingleEventHistoryGroup>(
      events,
      eventToStatus,
      eventToLabel,
      {}
    ),
  };
}
