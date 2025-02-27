import {
  cancelTimerTaskEvent,
  startTimerTaskEvent,
  fireTimerTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-timer-events';

import type { TimerHistoryEvent } from '../../../workflow-history.types';
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
    const missingStartEvent: TimerHistoryEvent[] =
      [fireTimerTaskEvent];

    const incompletedTimerGroup1 =
      getTimerGroupFromEvents(missingStartEvent);
    expect(incompletedTimerGroup1.hasMissingEvents).toBe(true);


    const missingCloseEvent: TimerHistoryEvent[] =
      [startTimerTaskEvent];

    const incompletedTimerGroup2 =
      getTimerGroupFromEvents(missingCloseEvent);
    expect(incompletedTimerGroup2.hasMissingEvents).toBe(true);

    
    const completedEvent: TimerHistoryEvent[] =
      [startTimerTaskEvent, cancelTimerTaskEvent];

    const completedTimerGroup =
      getTimerGroupFromEvents(completedEvent);
    expect(completedTimerGroup.hasMissingEvents).toBe(false);

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
});
