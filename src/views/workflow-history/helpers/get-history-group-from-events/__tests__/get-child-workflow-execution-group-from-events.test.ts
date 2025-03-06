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

jest.useFakeTimers().setSystemTime(new Date('2024-05-25'));

describe('getChildWorkflowExecutionGroupFromEvents', () => {
  it('should return a group with a proper label', () => {
    const events: ChildWorkflowExecutionHistoryEvent[] = [
      initiateChildWorkflowEvent,
    ];

    const expectedLabel = `Child Workflow: ${initiateChildWorkflowEvent.startChildWorkflowExecutionInitiatedEventAttributes?.workflowType?.name}`;

    const group = getChildWorkflowExecutionGroupFromEvents(events);

    expect(group.label).toBe(expectedLabel);
  });

  it('should return a group with hasMissingEvents set to true when any event is missing', () => {
    const assertions: Array<{
      name: string;
      events: ChildWorkflowExecutionHistoryEvent[];
      assertionValue: boolean;
    }> = [
      {
        name: 'missingInitiatedEvent',
        events: [initiateFailureChildWorkflowEvent],
        assertionValue: true,
      },
      {
        name: 'missingInitiationFailureAndCloseEvent',
        events: [initiateChildWorkflowEvent],
        assertionValue: true,
      },
      {
        name: 'missingCloseEvent',
        events: [initiateChildWorkflowEvent, startChildWorkflowEvent],
        assertionValue: true,
      },
      {
        name: 'missingStartEvent',
        events: [initiateChildWorkflowEvent, completeChildWorkflowEvent],
        assertionValue: true,
      },
      {
        name: 'completedFailedInitiationEvent',
        events: [initiateChildWorkflowEvent, initiateFailureChildWorkflowEvent],
        assertionValue: false,
      },
    ];

    assertions.forEach(({ name, events, assertionValue }) => {
      const group = getChildWorkflowExecutionGroupFromEvents(events);
      expect([name, group.hasMissingEvents]).toEqual([name, assertionValue]);
    });
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
      'Initiated at 21 Jun 1975, 10:47:51 UTC',
      'Initiation failed at 08 Sep, 04:27:52 UTC',
      'Started at 08 Sep, 04:27:53 UTC',
      'Completed at 08 Sep, 04:27:54 UTC',
      'Failed at 08 Sep, 04:27:58 UTC',
      'Timed out at 08 Sep, 04:27:57 UTC',
      'Canceled at 08 Sep, 04:27:55 UTC',
    ]);
  });
});
