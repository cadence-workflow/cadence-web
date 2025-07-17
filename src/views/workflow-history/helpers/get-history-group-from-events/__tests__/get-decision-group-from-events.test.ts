import {
  completeDecisionTaskEvent,
  failedDecisionTaskEvent,
  scheduleDecisionTaskEvent,
  startDecisionTaskEvent,
  timeoutDecisionTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-decision-events';
import {
  pendingDecisionTaskStartEvent,
  pendingDecisionTaskStartEventWithStartedState,
} from '@/views/workflow-history/__fixtures__/workflow-history-pending-events';

import type {
  ExtendedDecisionHistoryEvent,
  PendingDecisionTaskStartEvent,
} from '../../../workflow-history.types';
import getDecisionGroupFromEvents from '../get-decision-group-from-events';

jest.useFakeTimers().setSystemTime(new Date('2024-05-25'));

describe('getDecisionGroupFromEvents', () => {
  it('should return a group with a proper label', () => {
    const events: ExtendedDecisionHistoryEvent[] = [scheduleDecisionTaskEvent];

    const group = getDecisionGroupFromEvents(events);

    expect(group.label).toBe('Decision Task');
  });

  it('should return a group with hasMissingEvents set to true when any event is missing', () => {
    const assertions: Array<{
      name: string;
      events: ExtendedDecisionHistoryEvent[];
      assertionValue: boolean;
    }> = [
      {
        name: 'missingScheduleEvent',
        events: [startDecisionTaskEvent, completeDecisionTaskEvent],
        assertionValue: true,
      },
      {
        name: 'missingTimoutAndCloseEvent',
        events: [scheduleDecisionTaskEvent],
        assertionValue: true,
      },
      {
        name: 'missingStartEvent',
        events: [scheduleDecisionTaskEvent, completeDecisionTaskEvent],
        assertionValue: true,
      },
      {
        name: 'missingCompleteEvent',
        events: [scheduleDecisionTaskEvent, startDecisionTaskEvent],
        assertionValue: true,
      },
      {
        name: 'completeEvents',
        events: [
          scheduleDecisionTaskEvent,
          startDecisionTaskEvent,
          completeDecisionTaskEvent,
        ],
        assertionValue: false,
      },
      {
        name: 'timedoutEvents',
        events: [scheduleDecisionTaskEvent, timeoutDecisionTaskEvent],
        assertionValue: false,
      },
    ];

    assertions.forEach(({ name, events, assertionValue }) => {
      const group = getDecisionGroupFromEvents(events);
      expect([name, group.hasMissingEvents]).toEqual([name, assertionValue]);
    });
  });

  it('should return a group with groupType equal to Decision', () => {
    const events: ExtendedDecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
      completeDecisionTaskEvent,
    ];
    const group = getDecisionGroupFromEvents(events);
    expect(group.groupType).toBe('Decision');
  });

  it('should return group eventsMetadata with correct labels', () => {
    const events: ExtendedDecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      pendingDecisionTaskStartEvent,
      startDecisionTaskEvent,
      completeDecisionTaskEvent,
      failedDecisionTaskEvent,
      timeoutDecisionTaskEvent,
    ];
    const group = getDecisionGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ label }) => label)).toEqual([
      'Scheduled',
      'Starting',
      'Started',
      'Completed',
      'Failed',
      'Timed out',
    ]);
  });

  it('should return group eventsMetadata with correct status', () => {
    // just scheduled
    const scheduleEvents: ExtendedDecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
    ];
    const scheduledGroup = getDecisionGroupFromEvents(scheduleEvents);
    expect(scheduledGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'WAITING',
    ]);

    // pending start
    const pendingStartedEvents: PendingDecisionTaskStartEvent[] = [
      pendingDecisionTaskStartEvent,
    ];
    const pendingStartedGroup =
      getDecisionGroupFromEvents(pendingStartedEvents);
    expect(
      pendingStartedGroup.eventsMetadata.map(({ status }) => status)
    ).toEqual(['WAITING']);

    // started
    const startEvents: ExtendedDecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
    ];
    const startedGroup = getDecisionGroupFromEvents(startEvents);
    expect(startedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'ONGOING',
    ]);

    // Completed
    const completeEvents: ExtendedDecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
      completeDecisionTaskEvent,
    ];
    const completedGroup = getDecisionGroupFromEvents(completeEvents);
    expect(completedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
      'COMPLETED',
    ]);

    // Failed
    const failureEvents: ExtendedDecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
      failedDecisionTaskEvent,
    ];
    const failedGroup = getDecisionGroupFromEvents(failureEvents);
    expect(failedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
      'FAILED',
    ]);

    // Timed out
    const timeoutEvents: ExtendedDecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
      timeoutDecisionTaskEvent,
    ];
    const timedoutGroup = getDecisionGroupFromEvents(timeoutEvents);
    expect(timedoutGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
      'FAILED',
    ]);
  });

  it('should return group eventsMetadata with correct timeLabel', () => {
    const events: ExtendedDecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
      completeDecisionTaskEvent,
    ];
    const group = getDecisionGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ timeLabel }) => timeLabel)).toEqual([
      'Scheduled at 07 Sep, 22:16:10 UTC',
      'Started at 07 Sep, 22:16:10 UTC',
      'Completed at 07 Sep, 22:16:10 UTC',
    ]);
  });

  it('should use correct time label prefix for pending decision events', () => {
    const scheduledStateGroup = getDecisionGroupFromEvents([
      scheduleDecisionTaskEvent,
      pendingDecisionTaskStartEvent,
    ]);
    expect(scheduledStateGroup.eventsMetadata[1].timeLabel).toMatch(
      /^Scheduled at/
    );

    const startedStateGroup = getDecisionGroupFromEvents([
      scheduleDecisionTaskEvent,
      pendingDecisionTaskStartEventWithStartedState,
    ]);
    expect(startedStateGroup.eventsMetadata[1].timeLabel).toMatch(
      /^Started at/
    );
  });

  it('should return a badge if schedueled attempts are greater than zero', () => {
    const retryEvent = {
      ...scheduleDecisionTaskEvent,
      decisionTaskScheduledEventAttributes: {
        ...scheduleDecisionTaskEvent.decisionTaskScheduledEventAttributes,
        attempt: 2,
      },
    };
    const events: ExtendedDecisionHistoryEvent[] = [retryEvent];
    const group = getDecisionGroupFromEvents(events);
    expect(group.badges).toEqual([{ content: '2 Retries' }]);
  });

  it('should return a badge if pending start attempts are greater than zero', () => {
    const retryEvent = {
      ...pendingDecisionTaskStartEvent,
      pendingDecisionTaskStartEventAttributes: {
        ...pendingDecisionTaskStartEvent.pendingDecisionTaskStartEventAttributes,
        attempt: 2,
      },
    };
    const events: ExtendedDecisionHistoryEvent[] = [retryEvent];
    const group = getDecisionGroupFromEvents(events);
    expect(group.badges).toEqual([{ content: '2 Retries' }]);
  });

  it('should return no badge if attempts are zero', () => {
    const retryEvent = {
      ...scheduleDecisionTaskEvent,
      decisionTaskScheduledEventAttributes: {
        ...scheduleDecisionTaskEvent.decisionTaskScheduledEventAttributes,
        attempt: 0,
      },
    };
    const events: ExtendedDecisionHistoryEvent[] = [retryEvent];
    const group = getDecisionGroupFromEvents(events);
    expect(group.badges).toEqual([]);
  });

  it('should return a badge with "1 Retry" if attempts are equal to one', () => {
    const retryEvent = {
      ...scheduleDecisionTaskEvent,
      decisionTaskScheduledEventAttributes: {
        ...scheduleDecisionTaskEvent.decisionTaskScheduledEventAttributes,
        attempt: 1,
      },
    };
    const events: ExtendedDecisionHistoryEvent[] = [retryEvent];
    const group = getDecisionGroupFromEvents(events);
    expect(group.badges).toEqual([{ content: '1 Retry' }]);
  });

  it('should set resetToDecisionEventId to null when no close or timeout events are present', () => {
    const events: ExtendedDecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
    ];
    const group = getDecisionGroupFromEvents(events);
    expect(group.resetToDecisionEventId).toBeNull();
  });

  it('should set resetToDecisionEventId to the close event ID when a close event is present', () => {
    const events: ExtendedDecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
      completeDecisionTaskEvent,
    ];
    const group = getDecisionGroupFromEvents(events);
    expect(group.resetToDecisionEventId).toBe(
      completeDecisionTaskEvent.eventId
    );
  });

  it('should be set to the timeout event ID when only a timeout event is present', () => {
    const events: ExtendedDecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      timeoutDecisionTaskEvent,
    ];
    const group = getDecisionGroupFromEvents(events);
    expect(group.resetToDecisionEventId).toBe(timeoutDecisionTaskEvent.eventId);
  });

  it('should return group with closeTimeMs equal to closeEvent or timeoutEvent timeMs', () => {
    const group = getDecisionGroupFromEvents([
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
      completeDecisionTaskEvent,
    ]);
    expect(group.closeTimeMs).toEqual(1725747370599.273);

    const groupWithTimeoutEvent = getDecisionGroupFromEvents([
      scheduleDecisionTaskEvent,
      timeoutDecisionTaskEvent,
    ]);
    expect(groupWithTimeoutEvent.closeTimeMs).toEqual(1725747370599.273);

    const groupWithMissingCloseEvent = getDecisionGroupFromEvents([
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
    ]);
    expect(groupWithMissingCloseEvent.closeTimeMs).toEqual(null);
  });

  it('should include negativeFields for failed decision events', () => {
    const events: ExtendedDecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
      failedDecisionTaskEvent,
    ];
    const group = getDecisionGroupFromEvents(events);

    // The failed event should have negativeFields
    const failedEventMetadata = group.eventsMetadata.find(
      (metadata) => metadata.status === 'FAILED'
    );
    expect(failedEventMetadata?.negativeFields).toEqual(['reason', 'details']);

    // Other events should not have negativeFields
    const otherEventsMetadata = group.eventsMetadata.filter(
      (metadata) => metadata.status !== 'FAILED'
    );
    otherEventsMetadata.forEach((metadata) => {
      expect(metadata.negativeFields).toBeUndefined();
    });
  });
});
