import type {
  DecisionHistoryGroup,
  ExtendedDecisionHistoryEvent,
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getDecisionGroupFromEvents(
  events: ExtendedDecisionHistoryEvent[]
): DecisionHistoryGroup {
  const label = 'Decision Task';
  let hasMissingEvents = false;
  const groupType = 'Decision';
  const badges = [];

  const firstEvent = events[0];
  const scheduleAttr = 'decisionTaskScheduledEventAttributes';
  const pendingStartAttr = 'pendingDecisionTaskScheduleEventAttributes';

  let scheduleEvent: ExtendedDecisionHistoryEvent | undefined;
  let pendingScheduleEvent: ExtendedDecisionHistoryEvent | undefined;

  events.forEach((e) => {
    if (e.attributes === scheduleAttr) scheduleEvent = e;
    if (e.attributes === pendingStartAttr) pendingScheduleEvent = e;
  });

  if (
    firstEvent.attributes !== 'decisionTaskScheduledEventAttributes' &&
    firstEvent.attributes !== 'pendingDecisionTaskScheduleEventAttributes'
  ) {
    hasMissingEvents = true;
  }

  let retryAttemptNumber = 0;

  if (
    pendingScheduleEvent &&
    pendingStartAttr in pendingScheduleEvent &&
    pendingScheduleEvent[pendingStartAttr]?.attempt
  ) {
    retryAttemptNumber = pendingScheduleEvent[pendingStartAttr].attempt;
  }

  if (
    scheduleEvent &&
    scheduleAttr in scheduleEvent &&
    scheduleEvent[scheduleAttr]?.attempt
  ) {
    retryAttemptNumber = scheduleEvent[scheduleAttr].attempt;
  }

  if (retryAttemptNumber) {
    badges.push({
      content:
        retryAttemptNumber === 1 ? '1 Retry' : `${retryAttemptNumber} Retries`,
    });
  }
  const eventToLabel: HistoryGroupEventToStringMap<DecisionHistoryGroup> = {
    pendingDecisionTaskScheduleEventAttributes: 'Scheduling',
    decisionTaskScheduledEventAttributes: 'Scheduled',
    decisionTaskStartedEventAttributes: 'Started',
    decisionTaskCompletedEventAttributes: 'Completed',
    decisionTaskFailedEventAttributes: 'Failed',
    decisionTaskTimedOutEventAttributes: 'Timed out',
  };
  const eventToStatus: HistoryGroupEventToStatusMap<DecisionHistoryGroup> = {
    pendingDecisionTaskScheduleEventAttributes: 'WAITING',
    decisionTaskScheduledEventAttributes: (_, events, index) =>
      index < events.length - 1 ? 'COMPLETED' : 'WAITING',
    decisionTaskStartedEventAttributes: (_, events, index) =>
      index < events.length - 1 ? 'COMPLETED' : 'ONGOING',
    decisionTaskCompletedEventAttributes: 'COMPLETED',
    decisionTaskFailedEventAttributes: 'FAILED',
    decisionTaskTimedOutEventAttributes: 'FAILED',
  };

  return {
    label,
    hasMissingEvents,
    groupType,
    badges,
    ...getCommonHistoryGroupFields<DecisionHistoryGroup>(
      events,
      eventToStatus,
      eventToLabel,
      { pendingDecisionTaskScheduleEventAttributes: 'Scheduled at' }
    ),
  };
}
