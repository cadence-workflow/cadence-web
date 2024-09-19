import {
  cancelTimerTaskEvent,
  startTimerTaskEvent,
  fireTimerTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-timer-events';

import type { TimerHistoryEvent } from '../../../workflow-history.types';
import getTimerGroupFromEvents from '../get-timer-group-from-events';

describe('getTimerGroupFromEvents', () => {
  it('should return a group with a correct label', () => {
    const events: TimerHistoryEvent[] = [startTimerTaskEvent];

    const expectedLabel = `Timer ${startTimerTaskEvent.timerStartedEventAttributes?.timerId}`;

    const group = getTimerGroupFromEvents(events);

    expect(group.label).toBe(expectedLabel);
  });

  it('should return a group with hasMissingEvents set to true when start event is missing', () => {
    const fireEvents: TimerHistoryEvent[] = [fireTimerTaskEvent];
    const firedTimerGroup = getTimerGroupFromEvents(fireEvents);
    expect(firedTimerGroup.hasMissingEvents).toBe(true);

    const cancelEvents: TimerHistoryEvent[] = [cancelTimerTaskEvent];
    const canceledTimerGroup = getTimerGroupFromEvents(cancelEvents);
    expect(canceledTimerGroup.hasMissingEvents).toBe(true);
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
      'Started at 07 Sep, 22:32:50 GMT+0',
      'Fired at 07 Sep, 22:34:30 GMT+0',
    ]);
  });
});
