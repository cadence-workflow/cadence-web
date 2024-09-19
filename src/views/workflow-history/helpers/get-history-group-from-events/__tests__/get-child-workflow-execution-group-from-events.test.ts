import {
  cancelChildWorkflowEvent,
  completeChildWorkflowEvent,
  failChildWorkflowEvent,
  initiateChildWorkflowEvent,
  initiateFailureChildWorkflowEvent,
  startChildWorkflowEvent,
  timeoutChildWorkflowEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-child-workflow-events';

import type { ChildWorkflowExecutionHistoryEvent } from '../../../workflow-history.types';
import getChildWorkflowExecutionGroupFromEvents from '../get-child-workflow-execution-group-from-events';

describe('getChildWorkflowExecutionGroupFromEvents', () => {
  it('should return a group with a proper label', () => {
    const events: ChildWorkflowExecutionHistoryEvent[] = [
      initiateChildWorkflowEvent,
    ];

    const expectedLabel = `Child Workflow: ${initiateChildWorkflowEvent.startChildWorkflowExecutionInitiatedEventAttributes?.workflowType?.name}`;

    const group = getChildWorkflowExecutionGroupFromEvents(events);

    expect(group.label).toBe(expectedLabel);
  });

  it('should return a group with hasMissingEvents set to true when initiate event is missing', () => {
    const intiateFailedEvents: ChildWorkflowExecutionHistoryEvent[] = [
      initiateFailureChildWorkflowEvent,
    ];
    const intiateFailedChildWorkflowgroup =
      getChildWorkflowExecutionGroupFromEvents(intiateFailedEvents);
    expect(intiateFailedChildWorkflowgroup.hasMissingEvents).toBe(true);

    const completeEvents: ChildWorkflowExecutionHistoryEvent[] = [
      startChildWorkflowEvent,
      completeChildWorkflowEvent,
    ];
    const completedChildWorkflowgroup =
      getChildWorkflowExecutionGroupFromEvents(completeEvents);
    expect(completedChildWorkflowgroup.hasMissingEvents).toBe(true);

    const failureEvents: ChildWorkflowExecutionHistoryEvent[] = [
      startChildWorkflowEvent,
      failChildWorkflowEvent,
    ];
    const failedChildWorkflowgroup =
      getChildWorkflowExecutionGroupFromEvents(failureEvents);
    expect(failedChildWorkflowgroup.hasMissingEvents).toBe(true);

    const timeoutEvents: ChildWorkflowExecutionHistoryEvent[] = [
      startChildWorkflowEvent,
      timeoutChildWorkflowEvent,
    ];
    const timedoutChildWorkflowgroup =
      getChildWorkflowExecutionGroupFromEvents(timeoutEvents);
    expect(timedoutChildWorkflowgroup.hasMissingEvents).toBe(true);

    const cancelEvents: ChildWorkflowExecutionHistoryEvent[] = [
      startChildWorkflowEvent,
      cancelChildWorkflowEvent,
    ];
    const cancelChildWorkflowgroup =
      getChildWorkflowExecutionGroupFromEvents(cancelEvents);
    expect(cancelChildWorkflowgroup.hasMissingEvents).toBe(true);
  });

  it('should return a group with groupType equal to ChildWorkflow', () => {
    const events: ChildWorkflowExecutionHistoryEvent[] = [
      initiateChildWorkflowEvent,
      startChildWorkflowEvent,
      completeChildWorkflowEvent,
    ];
    const group = getChildWorkflowExecutionGroupFromEvents(events);
    expect(group.groupType).toBe('ChildWorkflowExecution');
  });

  it('should return group eventsMetadata with correct labels', () => {
    const events: ChildWorkflowExecutionHistoryEvent[] = [
      initiateChildWorkflowEvent,
      initiateFailureChildWorkflowEvent,
      startChildWorkflowEvent,
      completeChildWorkflowEvent,
      failChildWorkflowEvent,
      timeoutChildWorkflowEvent,
      cancelChildWorkflowEvent,
    ];
    const group = getChildWorkflowExecutionGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ label }) => label)).toEqual([
      'Initiated',
      'Initiation failed',
      'Started',
      'Completed',
      'Failed',
      'Timed out',
      'Canceled',
    ]);
  });

  it('should return group eventsMetadata with correct status', () => {
    // initiated
    const scheduleEvents: ChildWorkflowExecutionHistoryEvent[] = [
      initiateChildWorkflowEvent,
    ];
    const scheduledGroup =
      getChildWorkflowExecutionGroupFromEvents(scheduleEvents);
    expect(scheduledGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'WAITING',
    ]);

    // started
    const initiationFailedEvents: ChildWorkflowExecutionHistoryEvent[] = [
      initiateChildWorkflowEvent,
      failChildWorkflowEvent,
    ];
    const initiationFailedGroup = getChildWorkflowExecutionGroupFromEvents(
      initiationFailedEvents
    );
    expect(
      initiationFailedGroup.eventsMetadata.map(({ status }) => status)
    ).toEqual(['COMPLETED', 'FAILED']);

    // started
    const startEvents: ChildWorkflowExecutionHistoryEvent[] = [
      initiateChildWorkflowEvent,
      startChildWorkflowEvent,
    ];
    const startedGroup = getChildWorkflowExecutionGroupFromEvents(startEvents);
    expect(startedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'ONGOING',
    ]);

    // Completed
    const completeEvents: ChildWorkflowExecutionHistoryEvent[] = [
      initiateChildWorkflowEvent,
      startChildWorkflowEvent,
      completeChildWorkflowEvent,
    ];
    const completedGroup =
      getChildWorkflowExecutionGroupFromEvents(completeEvents);
    expect(completedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
      'COMPLETED',
    ]);

    // Failed
    const failureEvents: ChildWorkflowExecutionHistoryEvent[] = [
      initiateChildWorkflowEvent,
      startChildWorkflowEvent,
      failChildWorkflowEvent,
    ];
    const failedGroup = getChildWorkflowExecutionGroupFromEvents(failureEvents);
    expect(failedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
      'FAILED',
    ]);

    // Canceled
    const cancelEvents: ChildWorkflowExecutionHistoryEvent[] = [
      initiateChildWorkflowEvent,
      startChildWorkflowEvent,
      cancelChildWorkflowEvent,
    ];
    const canceledGroup =
      getChildWorkflowExecutionGroupFromEvents(cancelEvents);
    expect(canceledGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
      'CANCELED',
    ]);

    // Timed out
    const timeoutEvents: ChildWorkflowExecutionHistoryEvent[] = [
      initiateChildWorkflowEvent,
      startChildWorkflowEvent,
      timeoutChildWorkflowEvent,
    ];
    const timedoutGroup =
      getChildWorkflowExecutionGroupFromEvents(timeoutEvents);
    expect(timedoutGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
      'FAILED',
    ]);
  });

  it('should return group eventsMetadata with correct timeLabel', () => {
    const events: ChildWorkflowExecutionHistoryEvent[] = [
      initiateChildWorkflowEvent,
      initiateFailureChildWorkflowEvent,
      startChildWorkflowEvent,
      completeChildWorkflowEvent,
      failChildWorkflowEvent,
      timeoutChildWorkflowEvent,
      cancelChildWorkflowEvent,
    ];
    const group = getChildWorkflowExecutionGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ timeLabel }) => timeLabel)).toEqual([
      'Initiated at 21 Jun 1975, 10:47:51 GMT+0',
      'Initiation failed at 08 Sep, 04:27:52 GMT+0',
      'Started at 08 Sep, 04:27:53 GMT+0',
      'Completed at 08 Sep, 04:27:54 GMT+0',
      'Failed at 08 Sep, 04:27:58 GMT+0',
      'Timed out at 08 Sep, 04:27:57 GMT+0',
      'Canceled at 08 Sep, 04:27:55 GMT+0',
    ]);
  });
});
