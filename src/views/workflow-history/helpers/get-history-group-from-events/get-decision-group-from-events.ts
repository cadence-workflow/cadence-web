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
  const groupType = 'Decision';
  const badges = [];

  const pendingScheduleAttr = 'pendingDecisionTaskScheduleEventAttributes';
  const scheduleAttr = 'decisionTaskScheduledEventAttributes';
  const startAttr = 'decisionTaskStartedEventAttributes';
  const timeoutAttr = 'decisionTaskTimedOutEventAttributes';
  const closeAttrs = [
    'decisionTaskCompletedEventAttributes',
    'decisionTaskFailedEventAttributes',
  ];

  let scheduleEvent: ExtendedDecisionHistoryEvent | undefined;
  let pendingScheduleEvent: ExtendedDecisionHistoryEvent | undefined;
  let timeoutEvent: ExtendedDecisionHistoryEvent | undefined;
  let startEvent: ExtendedDecisionHistoryEvent | undefined;
  let closeEvent: ExtendedDecisionHistoryEvent | undefined;

  events.forEach((e) => {
    if (e.attributes === pendingScheduleAttr) pendingScheduleEvent = e;
    if (e.attributes === scheduleAttr) scheduleEvent = e;
    if (e.attributes === timeoutAttr) timeoutEvent = e;
    if (e.attributes === startAttr) startEvent = e;
    if (closeAttrs.includes(e.attributes)) closeEvent = e;
  });

  const hasAllTimeoutEvents = scheduleEvent && timeoutEvent;
  const hasAllCloseEvents = scheduleEvent && startEvent && closeEvent;
  const hasMissingEvents = !hasAllTimeoutEvents && !hasAllCloseEvents;

  let retryAttemptNumber = 0;
  if (
    pendingScheduleEvent &&
    pendingScheduleAttr in pendingScheduleEvent &&
    pendingScheduleEvent[pendingScheduleAttr]?.attempt
  ) {
    retryAttemptNumber = pendingScheduleEvent[pendingScheduleAttr].attempt;
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
