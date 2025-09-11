import { workflowExecutionSignaledEvent } from '@/views/workflow-history/__fixtures__/workflow-history-execution-signaled-event';

import type {
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  HistoryGroupEventToSummaryFieldsMap,
  WorkflowSignaledEventHistoryGroup,
  WorkflowSignaledHistoryEvent,
} from '../../../workflow-history.types';
import getWorkflowSignaledEventGroupFromEvents from '../get-workflow-signaled-event-group-from-events';

describe('getWorkflowSignaledEventGroupFromEvents', () => {
  const workflowSignaledEvent: WorkflowSignaledHistoryEvent = {
    ...workflowExecutionSignaledEvent,
    attributes: 'workflowExecutionSignaledEventAttributes',
  };

  const events: WorkflowSignaledHistoryEvent[] = [workflowSignaledEvent];

  it('should return a group with the correct label', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.label).toBe('Workflow Signaled');
  });

  it('should return a group with hasMissingEvents set to false', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.hasMissingEvents).toBe(false);
  });

  it('should return a group with groupType equal to WorkflowSignaled', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.groupType).toBe('WorkflowSignaled');
  });

  it('should return group eventsMetadata with correct label', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.eventsMetadata[0].label).toBe('Signaled');
  });

  it('should return group eventsMetadata with correct status', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.eventsMetadata[0].status).toBe('COMPLETED');
  });

  it('should return group with closeTimeMs equal to null', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.closeTimeMs).toEqual(null);
  });

  it('should return group with correct timeMs from event', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.timeMs).toEqual(1724747415549.3777);
  });

  it('should return group with correct startTimeMs from event', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.startTimeMs).toEqual(1724747415549.3777);
  });

  it('should return group with correct firstEventId', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.firstEventId).toBe('2');
  });

  it('should return group eventsMetadata with correct timeLabel', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.eventsMetadata[0].timeLabel).toMatch(/^Signaled at/);
  });

  it('should include summaryFields for workflow signaled events', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.eventsMetadata[0].summaryFields).toEqual([
      'signalName',
      'input',
    ]);
  });

  it('should not include negativeFields for workflow signaled events', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.eventsMetadata[0].negativeFields).toBeUndefined();
  });

  it('should not include additionalDetails for workflow signaled events', () => {
    const group = getWorkflowSignaledEventGroupFromEvents(events);
    expect(group.eventsMetadata[0].additionalDetails).toBeUndefined();
  });

  it('should handle multiple workflow signaled events correctly', () => {
    const secondEvent: WorkflowSignaledHistoryEvent = {
      ...workflowSignaledEvent,
      eventId: '3',
      eventTime: {
        seconds: '1724747500',
        nanos: 549377718,
      },
    };
    const multipleEvents = [workflowSignaledEvent, secondEvent];

    const group = getWorkflowSignaledEventGroupFromEvents(multipleEvents);

    expect(group.eventsMetadata).toHaveLength(2);
    expect(group.eventsMetadata[0].label).toBe('Signaled');
    expect(group.eventsMetadata[1].label).toBe('Signaled');
    expect(group.eventsMetadata[0].status).toBe('COMPLETED');
    expect(group.eventsMetadata[1].status).toBe('COMPLETED');
    expect(group.firstEventId).toBe('2');
    expect(group.timeMs).toEqual(1724747500549.3777); // Latest event time
    expect(group.startTimeMs).toEqual(1724747415549.3777); // First event time
  });

  it('should return correct event mappings as defined in implementation', () => {
    const expectedEventToLabel: HistoryGroupEventToStringMap<WorkflowSignaledEventHistoryGroup> =
      {
        workflowExecutionSignaledEventAttributes: 'Signaled',
      };

    const expectedEventToStatus: HistoryGroupEventToStatusMap<WorkflowSignaledEventHistoryGroup> =
      {
        workflowExecutionSignaledEventAttributes: 'COMPLETED',
      };

    const expectedEventToSummaryFields: HistoryGroupEventToSummaryFieldsMap<WorkflowSignaledEventHistoryGroup> =
      {
        workflowExecutionSignaledEventAttributes: ['signalName', 'input'],
      };

    const group = getWorkflowSignaledEventGroupFromEvents(events);

    expect(group.eventsMetadata[0].label).toBe(
      expectedEventToLabel[events[0].attributes]
    );
    expect(group.eventsMetadata[0].status).toBe(
      expectedEventToStatus[events[0].attributes]
    );
    expect(group.eventsMetadata[0].summaryFields).toEqual(
      expectedEventToSummaryFields[events[0].attributes]
    );
  });
});
