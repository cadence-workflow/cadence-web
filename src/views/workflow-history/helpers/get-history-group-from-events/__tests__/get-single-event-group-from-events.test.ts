import {
  startWorkflowExecutionEvent,
  signalWorkflowExecutionEvent,
  recordMarkerExecutionEvent,
  failWorkflowExecutionEvent,
  terminateWorkflowExecutionEvent,
  timeoutWorkflowExecutionEvent,
  completeWorkflowExecutionEvent,
  cancelRequestActivityTaskEvent,
  failCancelTimerEvent,
  failCancelRequestActivityTaskEvent,
  continueAsNewWorkflowExecutionEvent,
  requestCancelWorkflowExecutionEvent,
  upsertWorkflowSearchAttributesEvent,
  cancelWorkflowExecutionEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-single-events';

import type {
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  SingleEventHistoryGroup,
  SingleHistoryEvent,
} from '../../../workflow-history.types';
import getSingleEventGroupFromEvents from '../get-single-event-group-from-events';

describe('getSingleEventGroupFromEvents', () => {
  const events: SingleHistoryEvent[] = [
    startWorkflowExecutionEvent,
    signalWorkflowExecutionEvent,
    recordMarkerExecutionEvent,
    failWorkflowExecutionEvent,
    terminateWorkflowExecutionEvent,
    timeoutWorkflowExecutionEvent,
    completeWorkflowExecutionEvent,
    cancelRequestActivityTaskEvent,
    failCancelTimerEvent,
    failCancelRequestActivityTaskEvent,
    continueAsNewWorkflowExecutionEvent,
    requestCancelWorkflowExecutionEvent,
    upsertWorkflowSearchAttributesEvent,
    cancelWorkflowExecutionEvent,
  ];
  it('should return a group with a proper label when scheduled event exists', () => {
    const expectedLabels: Record<SingleHistoryEvent['attributes'], string> = {
      activityTaskCancelRequestedEventAttributes: `Activity ${cancelRequestActivityTaskEvent.activityTaskCancelRequestedEventAttributes?.activityId}: Cancel Request`,
      requestCancelActivityTaskFailedEventAttributes: `Activity ${failCancelRequestActivityTaskEvent.requestCancelActivityTaskFailedEventAttributes?.activityId}: Cancel Request Failed`,
      cancelTimerFailedEventAttributes: `Timer ${failCancelTimerEvent.cancelTimerFailedEventAttributes?.timerId}: Cancellation Failed`,
      markerRecordedEventAttributes: 'Version Marker: Version',
      upsertWorkflowSearchAttributesEventAttributes:
        'Workflow Search Attributes',
      workflowExecutionStartedEventAttributes: 'Workflow Started',
      workflowExecutionCompletedEventAttributes: 'Workflow Completed',
      workflowExecutionFailedEventAttributes: 'Workflow Failed',
      workflowExecutionTimedOutEventAttributes: 'Workflow Timed out',
      workflowExecutionSignaledEventAttributes: 'Workflow Signaled',
      workflowExecutionTerminatedEventAttributes: 'Workflow Terminated',
      workflowExecutionCancelRequestedEventAttributes:
        'Workflow Cancel Request',
      workflowExecutionCanceledEventAttributes: 'Workflow Canceled',
      workflowExecutionContinuedAsNewEventAttributes:
        'Workflow Continued As New',
    };
    for (const event of events) {
      const group = getSingleEventGroupFromEvents([event]);
      expect(group.label).toBe(expectedLabels[event.attributes]);
    }
  });

  it('should return a group with hasMissingEvents set to false for all event groups', () => {
    for (const event of events) {
      const group = getSingleEventGroupFromEvents([event]);
      expect(group.hasMissingEvents).toBe(false);
    }
  });

  it('should return a group with groupType equal to Event', () => {
    for (const event of events) {
      const group = getSingleEventGroupFromEvents([event]);
      expect(group.groupType).toBe('Event');
    }
  });

  it('should return group eventsMetadata with correct labels', () => {
    const eventToLabel: HistoryGroupEventToStringMap<SingleEventHistoryGroup> =
      {
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
    for (const event of events) {
      const group = getSingleEventGroupFromEvents([event]);
      expect(group.eventsMetadata[0].label).toBe(
        eventToLabel[event.attributes]
      );
    }
  });

  it('should return group eventsMetadata with correct status', () => {
    const eventToStatus: HistoryGroupEventToStatusMap<SingleEventHistoryGroup> =
      {
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
    for (const event of events) {
      const group = getSingleEventGroupFromEvents([event]);
      expect(group.eventsMetadata[0].status).toBe(
        eventToStatus[event.attributes]
      );
    }
  });
});
