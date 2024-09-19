import {
  completeDecisionTaskEvent,
  failedDecisionTaskEvent,
  scheduleDecisionTaskEvent,
  startDecisionTaskEvent,
  timeoutDecisionTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-decision-events';

import type { DecisionHistoryEvent } from '../../../workflow-history.types';
import getDecisionGroupFromEvents from '../get-decision-group-from-events';

describe('getDecisionGroupFromEvents', () => {
  it('should return a group with a proper label when scheduled event exists', () => {
    const events: DecisionHistoryEvent[] = [scheduleDecisionTaskEvent];

    const group = getDecisionGroupFromEvents(events);

    expect(group.label).toBe('Decision Task');
  });

  it('should return a group with hasMissingEvents set to true when scheduled event is missing', () => {
    const completeEvents: DecisionHistoryEvent[] = [
      startDecisionTaskEvent,
      completeDecisionTaskEvent,
    ];
    const completedDecisiongroup = getDecisionGroupFromEvents(completeEvents);
    expect(completedDecisiongroup.hasMissingEvents).toBe(true);

    const failureEvents: DecisionHistoryEvent[] = [
      startDecisionTaskEvent,
      failedDecisionTaskEvent,
    ];
    const failedDecisiongroup = getDecisionGroupFromEvents(failureEvents);
    expect(failedDecisiongroup.hasMissingEvents).toBe(true);

    const timeoutEvents: DecisionHistoryEvent[] = [
      startDecisionTaskEvent,
      timeoutDecisionTaskEvent,
    ];
    const timedoutDecisiongroup = getDecisionGroupFromEvents(timeoutEvents);
    expect(timedoutDecisiongroup.hasMissingEvents).toBe(true);
  });

  it('should return a group with groupType equal to Decision', () => {
    const events: DecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
      completeDecisionTaskEvent,
    ];
    const group = getDecisionGroupFromEvents(events);
    expect(group.groupType).toBe('Decision');
  });

  it('should return group eventsMetadata with correct labels', () => {
    const events: DecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
      completeDecisionTaskEvent,
      failedDecisionTaskEvent,
      timeoutDecisionTaskEvent,
    ];
    const group = getDecisionGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ label }) => label)).toEqual([
      'Scheduled',
      'Started',
      'Completed',
      'Failed',
      'Timed out',
    ]);
  });

  it('should return group eventsMetadata with correct status', () => {
    // just scheduled
    const scheduleEvents: DecisionHistoryEvent[] = [scheduleDecisionTaskEvent];
    const scheduledGroup = getDecisionGroupFromEvents(scheduleEvents);
    expect(scheduledGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'WAITING',
    ]);

    // started
    const startEvents: DecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
    ];
    const startedGroup = getDecisionGroupFromEvents(startEvents);
    expect(startedGroup.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'ONGOING',
    ]);

    // Completed
    const completeEvents: DecisionHistoryEvent[] = [
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
    const failureEvents: DecisionHistoryEvent[] = [
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
    const timeoutEvents: DecisionHistoryEvent[] = [
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
    const events: DecisionHistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
      completeDecisionTaskEvent,
    ];
    const group = getDecisionGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ timeLabel }) => timeLabel)).toEqual([
      'Scheduled at 07 Sep, 22:16:10 GMT+0',
      'Started at 07 Sep, 22:16:10 GMT+0',
      'Completed at 07 Sep, 22:16:10 GMT+0',
    ]);
  });
});
