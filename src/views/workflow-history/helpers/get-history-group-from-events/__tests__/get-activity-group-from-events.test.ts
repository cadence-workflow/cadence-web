import {
  cancelActivityTaskEvent,
  completeActivityTaskEvent,
  failedActivityTaskEvent,
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
  timeoutActivityTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-activity-events';
import {
  pendingActivityTaskStartEvent,
  pendingActivityTaskStartEventWithStartedState,
} from '@/views/workflow-history/__fixtures__/workflow-history-pending-events';
import * as shortenGroupLabelsConfigModule from '@/views/workflow-history/config/workflow-history-should-shorten-group-labels.config';

import type { ExtendedActivityHistoryEvent } from '../../../workflow-history.types';
import getActivityGroupFromEvents from '../get-activity-group-from-events';

jest.useFakeTimers().setSystemTime(new Date('2024-05-25'));

jest.mock(
  '@/views/workflow-history/config/workflow-history-should-shorten-group-labels.config',
  () => ({
    __esModule: true,
    get default() {
      return false;
    },
  })
);

describe('getActivityGroupFromEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a group with a proper label when scheduled event exists', () => {
    const events: ExtendedActivityHistoryEvent[] = [scheduleActivityTaskEvent];

    const scheduelAttrs =
      scheduleActivityTaskEvent.activityTaskScheduledEventAttributes;
    const expectedLabel = `Activity ${scheduelAttrs?.activityId}: ${scheduelAttrs?.activityType?.name}`;

    const group = getActivityGroupFromEvents(events);

    expect(group.label).toBe(expectedLabel);
  });

  it('should return a group with empty label when scheduled event is missing', () => {
    const completeEvents: ExtendedActivityHistoryEvent[] = [
      startActivityTaskEvent,
      completeActivityTaskEvent,
    ];
    const completedActivitygroup = getActivityGroupFromEvents(completeEvents);
    expect(completedActivitygroup.label).toBe('');

    const failureEvents: ExtendedActivityHistoryEvent[] = [
      startActivityTaskEvent,
      failedActivityTaskEvent,
    ];
    const failedActivitygroup = getActivityGroupFromEvents(failureEvents);
    expect(failedActivitygroup.label).toBe('');

    const timeoutEvents: ExtendedActivityHistoryEvent[] = [
      startActivityTaskEvent,
      timeoutActivityTaskEvent,
    ];
    const timedoutActivitygroup = getActivityGroupFromEvents(timeoutEvents);
    expect(timedoutActivitygroup.label).toBe('');
  });

  it('should return a group with hasMissingEvents when any event is missing', () => {
    const assertions: Array<{
      name: string;
      events: ExtendedActivityHistoryEvent[];
      assertionValue: boolean;
    }> = [
      {
        name: 'missingCloseEvent',
        events: [scheduleActivityTaskEvent, startActivityTaskEvent],
        assertionValue: true,
      },
      {
        name: 'missingScheduleEvent',
        events: [startActivityTaskEvent, failedActivityTaskEvent],
        assertionValue: true,
      },
      {
        name: 'missingTimoutAndCloseEvent',
        events: [scheduleActivityTaskEvent],
        assertionValue: true,
      },
      {
        name: 'completeEvents',
        events: [
          scheduleActivityTaskEvent,
          startActivityTaskEvent,
          completeActivityTaskEvent,
        ],
        assertionValue: false,
      },
      {
        name: 'timedoutEvents',
        events: [scheduleActivityTaskEvent, timeoutActivityTaskEvent],
        assertionValue: false,
      },
    ];

    assertions.forEach(({ name, events, assertionValue }) => {
      const group = getActivityGroupFromEvents(events);
      expect([name, group.hasMissingEvents]).toEqual([name, assertionValue]);
    });
  });

  it('should return a group with groupType equal to Activity', () => {
    const events: ExtendedActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      completeActivityTaskEvent,
    ];
    const group = getActivityGroupFromEvents(events);
    expect(group.groupType).toBe('Activity');
  });

  it('should return group eventsMetadata with correct labels', () => {
    const events: ExtendedActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      pendingActivityTaskStartEvent,
      startActivityTaskEvent,
      completeActivityTaskEvent,
      failedActivityTaskEvent,
      timeoutActivityTaskEvent,
      cancelActivityTaskEvent,
    ];
    const group = getActivityGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ label }) => label)).toEqual([
      'Scheduled',
      'Starting',
      'Started',
      'Completed',
      'Failed',
      'Timed out',
      'Canceled',
    ]);
  });

  it('should return group eventsMetadata with correct status', () => {
    // just scheduled
    const scheduleEvents: ExtendedActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
    ];
    const scheduledGroup = getActivityGroupFromEvents(scheduleEvents);
    expect(scheduledGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'WAITING',
    ]);

    // started
    const startEvents: ExtendedActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
    ];
    const startedGroup = getActivityGroupFromEvents(startEvents);
    expect(startedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'ONGOING',
    ]);

    // Completed
    const completeEvents: ExtendedActivityHistoryEvent[] = [
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
    const failureEvents: ExtendedActivityHistoryEvent[] = [
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
    const cancelEvents: ExtendedActivityHistoryEvent[] = [
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
    const timeoutEvents: ExtendedActivityHistoryEvent[] = [
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
    const events: ExtendedActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      completeActivityTaskEvent,
    ];
    const group = getActivityGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ timeLabel }) => timeLabel)).toEqual([
      'Scheduled at 07 Sep, 22:16:10 UTC',
      'Started at 07 Sep, 22:16:10 UTC',
      'Completed at 07 Sep, 22:16:10 UTC',
    ]);
  });

  it('should use correct time label prefix for pending activity events', () => {
    const groupWithScheduledState = getActivityGroupFromEvents([
      scheduleActivityTaskEvent,
      pendingActivityTaskStartEvent,
    ]);
    expect(groupWithScheduledState.eventsMetadata[1].timeLabel).toMatch(
      /^Scheduled at/
    );

    const groupWithStartedState = getActivityGroupFromEvents([
      scheduleActivityTaskEvent,
      pendingActivityTaskStartEventWithStartedState,
    ]);
    expect(groupWithStartedState.eventsMetadata[1].timeLabel).toMatch(
      /^Last started at/
    );
  });

  it('should return group with closeTimeMs equal to closeEvent or timeoutEvent timeMs', () => {
    const group = getActivityGroupFromEvents([
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      completeActivityTaskEvent,
    ]);
    expect(group.closeTimeMs).toEqual(1725747370632.0728);

    const groupWithTimeoutEvent = getActivityGroupFromEvents([
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      timeoutActivityTaskEvent,
    ]);
    expect(groupWithTimeoutEvent.closeTimeMs).toEqual(1725747370632.0728);

    const groupWithMissingCloseEvent = getActivityGroupFromEvents([
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
    ]);
    expect(groupWithMissingCloseEvent.closeTimeMs).toEqual(null);
  });

  it('should return a short label when short names are enabled and activityName contains a dot', () => {
    jest
      .spyOn(shortenGroupLabelsConfigModule, 'default', 'get')
      .mockReturnValueOnce(true);

    const events: ExtendedActivityHistoryEvent[] = [scheduleActivityTaskEvent];

    const group = getActivityGroupFromEvents(events);

    expect(group.shortLabel).toBe('Activity 0: Start');

    const eventsWithoutDot: ExtendedActivityHistoryEvent[] = [
      {
        ...scheduleActivityTaskEvent,
        activityTaskScheduledEventAttributes: {
          ...scheduleActivityTaskEvent.activityTaskScheduledEventAttributes,
          activityType: {
            ...scheduleActivityTaskEvent.activityTaskScheduledEventAttributes
              .activityType,
            name: 'name-without-dot',
          },
        },
      },
    ];

    const groupWithoutDot = getActivityGroupFromEvents(eventsWithoutDot);

    expect(groupWithoutDot.shortLabel).toBeUndefined();
  });

  it('should return no short label when short names are disabled', () => {
    jest
      .spyOn(shortenGroupLabelsConfigModule, 'default', 'get')
      .mockReturnValueOnce(false);

    const events: ExtendedActivityHistoryEvent[] = [scheduleActivityTaskEvent];

    const group = getActivityGroupFromEvents(events);

    expect(group.shortLabel).toBeUndefined();
  });

  it('should include negativeFields for failed activity events', () => {
    const events: ExtendedActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      failedActivityTaskEvent,
    ];
    const group = getActivityGroupFromEvents(events);

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

  it('should include negativeFields for timed out activity events', () => {
    const events: ExtendedActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
      timeoutActivityTaskEvent,
    ];
    const group = getActivityGroupFromEvents(events);

    // The timed out event should have negativeFields
    const timedOutEventMetadata = group.eventsMetadata.find(
      (metadata) => metadata.status === 'FAILED' // timeout events have FAILED status
    );
    expect(timedOutEventMetadata?.negativeFields).toEqual([
      'reason',
      'details',
    ]);

    // Other events should not have negativeFields
    const otherEventsMetadata = group.eventsMetadata.filter(
      (metadata) => metadata.status !== 'FAILED'
    );
    otherEventsMetadata.forEach((metadata) => {
      expect(metadata.negativeFields).toBeUndefined();
    });
  });
});
