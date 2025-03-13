import type {
  DecisionHistoryGroup,
  ExtendedDecisionHistoryEvent,
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  PendingDecisionTaskStartEvent,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getDecisionGroupFromEvents(
  events: ExtendedDecisionHistoryEvent[]
): DecisionHistoryGroup {
  const label = 'Decision Task';
  const groupType = 'Decision';
  const badges = [];

  const scheduleAttr = 'decisionTaskScheduledEventAttributes';
  const pendingStartAttr = 'pendingDecisionTaskStartEventAttributes';
  const startAttr = 'decisionTaskStartedEventAttributes';
  const timeoutAttr = 'decisionTaskTimedOutEventAttributes';
  const closeAttrs = [
    'decisionTaskCompletedEventAttributes',
    'decisionTaskFailedEventAttributes',
  ];

  let scheduleEvent: ExtendedDecisionHistoryEvent | undefined;
  let pendingStartEvent: PendingDecisionTaskStartEvent | undefined;
  let timeoutEvent: ExtendedDecisionHistoryEvent | undefined;
  let startEvent: ExtendedDecisionHistoryEvent | undefined;
  let closeEvent: ExtendedDecisionHistoryEvent | undefined;

  events.forEach((e) => {
    if (e.attributes === pendingStartAttr) pendingStartEvent = e;
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
    pendingStartEvent &&
    pendingStartAttr in pendingStartEvent &&
    pendingStartEvent[pendingStartAttr]?.attempt
  ) {
    retryAttemptNumber = pendingStartEvent[pendingStartAttr].attempt;
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
    decisionTaskScheduledEventAttributes: 'Scheduled',
    pendingDecisionTaskStartEventAttributes: 'Starting',
    decisionTaskStartedEventAttributes: 'Started',
    decisionTaskCompletedEventAttributes: 'Completed',
    decisionTaskFailedEventAttributes: 'Failed',
    decisionTaskTimedOutEventAttributes: 'Timed out',
  };
  const eventToStatus: HistoryGroupEventToStatusMap<DecisionHistoryGroup> = {
    decisionTaskScheduledEventAttributes: (_, events, index) =>
      index < events.length - 1 ? 'COMPLETED' : 'WAITING',
    pendingDecisionTaskStartEventAttributes: 'WAITING',
    decisionTaskStartedEventAttributes: (_, events, index) =>
      index < events.length - 1 ? 'COMPLETED' : 'ONGOING',
    decisionTaskCompletedEventAttributes: 'COMPLETED',
    decisionTaskFailedEventAttributes: 'FAILED',
    decisionTaskTimedOutEventAttributes: 'FAILED',
  };

  const pendingStartEventTimePrefix = pendingStartEvent?.[pendingStartAttr]
    .startedTime
    ? 'Started at'
    : 'Scheduled at';

  return {
    label,
    hasMissingEvents,
    groupType,
    badges,
    ...getCommonHistoryGroupFields<DecisionHistoryGroup>(
      events,
      eventToStatus,
      eventToLabel,
      {
        pendingDecisionTaskStartEventAttributes: pendingStartEventTimePrefix,
      }
    ),
  };
}
