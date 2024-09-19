import {
  cancelActivityTaskEvent,
  completeActivityTaskEvent,
  failedActivityTaskEvent,
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
  timeoutActivityTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-activity-events';

import type { ActivityHistoryEvent } from '../../../workflow-history.types';
import getActivityGroupFromEvents from '../get-activity-group-from-events';

describe('getActivityGroupFromEvents', () => {
  it('should return a group with a proper label when scheduled event exists', () => {
    const events: ActivityHistoryEvent[] = [scheduleActivityTaskEvent];

    const scheduelAttrs =
      scheduleActivityTaskEvent.activityTaskScheduledEventAttributes;
    const expectedLabel = `Activity ${scheduelAttrs?.activityId}: ${scheduelAttrs?.activityType?.name}`;

    const group = getActivityGroupFromEvents(events);

    expect(group.label).toBe(expectedLabel);
  });

  it('should return a group with empty label when scheduled event is missing', () => {
    const completeEvents: ActivityHistoryEvent[] = [
      startActivityTaskEvent,
      completeActivityTaskEvent,
    ];
    const completedActivitygroup = getActivityGroupFromEvents(completeEvents);
    expect(completedActivitygroup.label).toBe('');

    const failureEvents: ActivityHistoryEvent[] = [
      startActivityTaskEvent,
      failedActivityTaskEvent,
    ];
    const failedActivitygroup = getActivityGroupFromEvents(failureEvents);
    expect(failedActivitygroup.label).toBe('');

    const timeoutEvents: ActivityHistoryEvent[] = [
      startActivityTaskEvent,
      timeoutActivityTaskEvent,
    ];
    const timedoutActivitygroup = getActivityGroupFromEvents(timeoutEvents);
    expect(timedoutActivitygroup.label).toBe('');
  });

  it('should return a group with hasMissingEvents set to true when scheduled event is missing', () => {
    const completeEvents: ActivityHistoryEvent[] = [
      startActivityTaskEvent,
      completeActivityTaskEvent,
    ];
    const completedActivitygroup = getActivityGroupFromEvents(completeEvents);
    expect(completedActivitygroup.hasMissingEvents).toBe(true);

    const failureEvents: ActivityHistoryEvent[] = [
      startActivityTaskEvent,
      failedActivityTaskEvent,
    ];
    const failedActivitygroup = getActivityGroupFromEvents(failureEvents);
    expect(failedActivitygroup.hasMissingEvents).toBe(true);

    const timeoutEvents: ActivityHistoryEvent[] = [
      startActivityTaskEvent,
      timeoutActivityTaskEvent,
    ];
    const timedoutActivitygroup = getActivityGroupFromEvents(timeoutEvents);
    expect(timedoutActivitygroup.hasMissingEvents).toBe(true);
  });

  it('should return a group with groupType equal to Activity', () => {
    const events: ActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      completeActivityTaskEvent,
    ];
    const group = getActivityGroupFromEvents(events);
    expect(group.groupType).toBe('Activity');
  });

  it('should return group eventsMetadata with correct labels', () => {
    const events: ActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      completeActivityTaskEvent,
      failedActivityTaskEvent,
      timeoutActivityTaskEvent,
      cancelActivityTaskEvent,
    ];
    const group = getActivityGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ label }) => label)).toEqual([
      'Scheduled',
      'Started',
      'Completed',
      'Failed',
      'Timed out',
      'Canceled',
    ]);
  });

  it('should return group eventsMetadata with correct status', () => {
    // just scheduled
    const scheduleEvents: ActivityHistoryEvent[] = [scheduleActivityTaskEvent];
    const scheduledGroup = getActivityGroupFromEvents(scheduleEvents);
    expect(scheduledGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'WAITING',
    ]);

    // started
    const startEvents: ActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
    ];
    const startedGroup = getActivityGroupFromEvents(startEvents);
    expect(startedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'ONGOING',
    ]);

    // Completed
    const completeEvents: ActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      completeActivityTaskEvent,
    ];
    const completedGroup = getActivityGroupFromEvents(completeEvents);
    expect(completedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
      'COMPLETED',
    ]);

    // Failed
    const failureEvents: ActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      failedActivityTaskEvent,
    ];
    const failedGroup = getActivityGroupFromEvents(failureEvents);
    expect(failedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
      'FAILED',
    ]);

    // Canceled
    const cancelEvents: ActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      cancelActivityTaskEvent,
    ];
    const canceledGroup = getActivityGroupFromEvents(cancelEvents);
    expect(canceledGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
      'CANCELED',
    ]);

    // Timed out
    const timeoutEvents: ActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      timeoutActivityTaskEvent,
    ];
    const timedoutGroup = getActivityGroupFromEvents(timeoutEvents);
    expect(timedoutGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
      'FAILED',
    ]);
  });

  it('should return group eventsMetadata with correct timeLabel', () => {
    const events: ActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      completeActivityTaskEvent,
    ];
    const group = getActivityGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ timeLabel }) => timeLabel)).toEqual([
      'Scheduled at 07 Sep, 22:16:10 GMT+0',
      'Started at 07 Sep, 22:16:10 GMT+0',
      'Completed at 07 Sep, 22:16:10 GMT+0',
    ]);
  });
});
