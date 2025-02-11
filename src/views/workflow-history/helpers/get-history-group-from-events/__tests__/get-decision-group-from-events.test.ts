import {
  completeDecisionTaskEvent,
  failedDecisionTaskEvent,
  scheduleDecisionTaskEvent,
  startDecisionTaskEvent,
  timeoutDecisionTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-decision-events';
import { pendingDecisionTaskScheduleEvent } from '@/views/workflow-history/__fixtures__/workflow-history-pending-events';

import type {
  ExtendedDecisionHistoryEvent,
  PendingDecisionTaskScheduleEvent,
} from '../../../workflow-history.types';
import getDecisionGroupFromEvents from '../get-decision-group-from-events';

jest.useFakeTimers().setSystemTime(new Date('2024-05-25'));

describe('getDecisionGroupFromEvents', () => {
  it('should return a group with a proper label', () => {
    const events: ExtendedDecisionHistoryEvent[] = [scheduleDecisionTaskEvent];

    const group = getDecisionGroupFromEvents(events);

    expect(group.label).toBe('Decision Task');
  });

  it('should return a group with hasMissingEvents set to true when scheduled event is missing', () => {
    const completeEvents: ExtendedDecisionHistoryEvent[] = [
      startDecisionTaskEvent,
      completeDecisionTaskEvent,
    ];
    const completedDecisiongroup = getDecisionGroupFromEvents(completeEvents);
    expect(completedDecisiongroup.hasMissingEvents).toBe(true);

    const failureEvents: ExtendedDecisionHistoryEvent[] = [
      startDecisionTaskEvent,
      failedDecisionTaskEvent,
    ];
    const failedDecisiongroup = getDecisionGroupFromEvents(failureEvents);
    expect(failedDecisiongroup.hasMissingEvents).toBe(true);

    const timeoutEvents: ExtendedDecisionHistoryEvent[] = [
      startDecisionTaskEvent,
      timeoutDecisionTaskEvent,
    ];
    const timedoutDecisiongroup = getDecisionGroupFromEvents(timeoutEvents);
    expect(timedoutDecisiongroup.hasMissingEvents).toBe(true);
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
      pendingDecisionTaskScheduleEvent,
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
      completeDecisionTaskEvent,
      failedDecisionTaskEvent,
      timeoutDecisionTaskEvent,
    ];
    const group = getDecisionGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ label }) => label)).toEqual([
      'Scheduling',
      'Scheduled',
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

    // pending schedule
    const pendingScheduleEvents: PendingDecisionTaskScheduleEvent[] = [
      pendingDecisionTaskScheduleEvent,
    ];
    const pendingScheduledGroup = getDecisionGroupFromEvents(
      pendingScheduleEvents
    );
    expect(
      pendingScheduledGroup.eventsMetadata.map(({ status }) => status)
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

  it('should return a badge if pending schedueled attempts are greater than zero', () => {
    const retryEvent = {
      ...pendingDecisionTaskScheduleEvent,
      pendingDecisionTaskScheduleEventAttributes: {
        ...pendingDecisionTaskScheduleEvent.pendingDecisionTaskScheduleEventAttributes,
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
});
