import {
  cancelTimerTaskEvent,
  startTimerTaskEvent,
  fireTimerTaskEvent,
} from '../../../__fixtures__/workflow-history-timer-events';
import type { TimerHistoryEvent } from '../../../workflow-history-v2.types';
import getTimerGroupFromEvents from '../get-timer-group-from-events';

jest.useFakeTimers().setSystemTime(new Date('2024-05-25'));

describe('getTimerGroupFromEvents', () => {
  it('should return a group with a correct label', () => {
    const events: TimerHistoryEvent[] = [startTimerTaskEvent];

    const expectedLabel = `Timer ${startTimerTaskEvent.timerStartedEventAttributes?.timerId}`;

    const group = getTimerGroupFromEvents(events);

    expect(group.label).toBe(expectedLabel);
  });

  it('should return a group with hasMissingEvents set to true when any event is missing', () => {
    const assertions: Array<{
      name: string;
      events: TimerHistoryEvent[];
      assertionValue: boolean;
    }> = [
      {
        name: 'missingStartEvent',
        events: [fireTimerTaskEvent],
        assertionValue: true,
      },
      {
        name: 'missingCloseEvent',
        events: [startTimerTaskEvent],
        assertionValue: true,
      },
      {
        name: 'completeEvents',
        events: [startTimerTaskEvent, fireTimerTaskEvent],
        assertionValue: false,
      },
    ];

    assertions.forEach(({ name, events, assertionValue }) => {
      const group = getTimerGroupFromEvents(events);
      expect([name, group.hasMissingEvents]).toEqual([name, assertionValue]);
    });
  });

  it('should return a group with groupType equal to Timer', () => {
    const events: TimerHistoryEvent[] = [
      startTimerTaskEvent,
      fireTimerTaskEvent,
    ];
    const group = getTimerGroupFromEvents(events);
    expect(group.groupType).toBe('Timer');
  });

  it('should return group eventsMetadata with correct labels', () => {
    const events: TimerHistoryEvent[] = [
      startTimerTaskEvent,
      fireTimerTaskEvent,
      cancelTimerTaskEvent,
    ];
    const group = getTimerGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ label }) => label)).toEqual([
      'Started',
      'Fired',
      'Canceled',
    ]);
  });

  it('should return group eventsMetadata with correct status', () => {
    // started
    const startEvents: TimerHistoryEvent[] = [startTimerTaskEvent];
    const startedGroup = getTimerGroupFromEvents(startEvents);
    expect(startedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'ONGOING',
    ]);

    // Fired
    const firedEvents: TimerHistoryEvent[] = [
      startTimerTaskEvent,
      fireTimerTaskEvent,
    ];
    const firedGroup = getTimerGroupFromEvents(firedEvents);
    expect(firedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
    ]);

    // Canceled
    const canceledEvents: TimerHistoryEvent[] = [
      startTimerTaskEvent,
      cancelTimerTaskEvent,
    ];
    const canceledGroup = getTimerGroupFromEvents(canceledEvents);
    expect(canceledGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'CANCELED',
    ]);
  });

  it('should return group eventsMetadata with correct timeLabel', () => {
    const events: TimerHistoryEvent[] = [
      startTimerTaskEvent,
      fireTimerTaskEvent,
    ];
    const group = getTimerGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ timeLabel }) => timeLabel)).toEqual([
      'Started at 07 Sep, 22:32:50 UTC',
      'Fired at 07 Sep, 22:34:30 UTC',
    ]);
  });

  it('should return group with closeTimeMs equal to closeEvent timeMs', () => {
    const group = getTimerGroupFromEvents([
      startTimerTaskEvent,
      fireTimerTaskEvent,
    ]);
    expect(group.closeTimeMs).toEqual(1725748470005.1672);

    const groupWithMissingCloseEvent = getTimerGroupFromEvents([
      startTimerTaskEvent,
    ]);
    expect(groupWithMissingCloseEvent.closeTimeMs).toEqual(null);
  });

  it('should include summaryFields for started timer events', () => {
    const events: TimerHistoryEvent[] = [
      startTimerTaskEvent,
      fireTimerTaskEvent,
    ];
    const group = getTimerGroupFromEvents(events);

    // The started event should have summaryFields
    const startedEventMetadata = group.eventsMetadata[0];
    expect(startedEventMetadata.summaryFields).toEqual([
      'startToFireTimeoutSeconds',
    ]);

    // Other events should not have summaryFields
    const otherEventMetadata = group.eventsMetadata[1];
    expect(otherEventMetadata.summaryFields).toBeUndefined();
  });

  it('should calculate expectedEndTimeInfo for started timer events without close event', () => {
    const eventsWithoutClose: TimerHistoryEvent[] = [startTimerTaskEvent];
    const group = getTimerGroupFromEvents(eventsWithoutClose);

    expect(group.expectedEndTimeInfo).toEqual({
      timeMs: 1725748375632.0728,
      prefix: 'Fires in',
    });
  });

  it('should not calculate expectedEndTimeInfo for timer events with close event', () => {
    const eventsWithClose: TimerHistoryEvent[] = [
      startTimerTaskEvent,
      fireTimerTaskEvent,
    ];
    const group = getTimerGroupFromEvents(eventsWithClose);

    // Should not calculate expectedEndTimeInfo when there's a close event
    expect(group.expectedEndTimeInfo).toBeUndefined();
  });

  it('should not calculate expectedEndTimeInfo for timer events without started event', () => {
    const eventsWithoutStart: TimerHistoryEvent[] = [fireTimerTaskEvent];
    const group = getTimerGroupFromEvents(eventsWithoutStart);

    // Should not calculate expectedEndTimeInfo when there's no started event
    expect(group.expectedEndTimeInfo).toBeUndefined();
  });

  it('should not calculate expectedEndTimeInfo for started timer events without startToFireTimeout', () => {
    const eventWithoutTimeout = {
      ...startTimerTaskEvent,
      timerStartedEventAttributes: {
        ...startTimerTaskEvent.timerStartedEventAttributes,
        startToFireTimeout: null,
      },
    };

    const group = getTimerGroupFromEvents([eventWithoutTimeout]);
    expect(group.expectedEndTimeInfo).toBeUndefined();
  });
});
