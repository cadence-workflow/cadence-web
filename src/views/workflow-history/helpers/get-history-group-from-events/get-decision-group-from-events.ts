import type {
  DecisionHistoryGroup,
  ExtendedDecisionHistoryEvent,
  HistoryGroupEventToNegativeFieldsMap,
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  HistoryGroupEventToSummaryFieldsMap,
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

  // The pending event stands in for events history has not written yet.
  // Drop it once history has the start, close, or timeout.
  const shouldShowPendingEvent = Boolean(
    pendingStartEvent && !(startEvent || closeEvent || timeoutEvent)
  );
  const shownPendingEvent = shouldShowPendingEvent
    ? pendingStartEvent
    : undefined;

  const finalEvents = shouldShowPendingEvent
    ? events
    : events.filter((e) => e.attributes !== pendingStartAttr);

  const hasAllTimeoutEvents = scheduleEvent && timeoutEvent;
  const hasAllCloseEvents = scheduleEvent && startEvent && closeEvent;
  const hasMissingEvents = !hasAllTimeoutEvents && !hasAllCloseEvents;

  // Retry attempts calculation
  let retryAttemptNumber = 0;

  if (
    scheduleEvent &&
    scheduleAttr in scheduleEvent &&
    scheduleEvent[scheduleAttr]?.attempt
  ) {
    retryAttemptNumber = scheduleEvent[scheduleAttr].attempt;
  }

  // Live pending attempt is authoritative: a first-written scheduled event can
  // lag at attempt 0 while the retry loop has already advanced
  if (
    shownPendingEvent &&
    pendingStartAttr in shownPendingEvent &&
    shownPendingEvent[pendingStartAttr]?.attempt
  ) {
    retryAttemptNumber = shownPendingEvent[pendingStartAttr].attempt;
  }

  if (retryAttemptNumber) {
    badges.push({
      content:
        retryAttemptNumber === 1 ? '1 Retry' : `${retryAttemptNumber} Retries`,
    });
  }

  // set resetToDecisionEventId to close/timeout decision event id
  let resetToDecisionEventId: string | null = null;

  if (closeEvent && closeEvent.eventId) {
    resetToDecisionEventId = closeEvent.eventId;
  } else if (timeoutEvent && timeoutEvent.eventId) {
    resetToDecisionEventId = timeoutEvent.eventId;
  }

  const pendingStateToLabel: Record<
    PendingDecisionTaskStartEvent['pendingDecisionTaskStartEventAttributes']['state'],
    string
  > = {
    PENDING_DECISION_STATE_SCHEDULED: 'Starting',
    PENDING_DECISION_STATE_STARTED: 'Running',
  };
  const pendingState = shownPendingEvent?.[pendingStartAttr].state;

  // populate event to label and status maps
  const eventToLabel: HistoryGroupEventToStringMap<DecisionHistoryGroup> = {
    decisionTaskScheduledEventAttributes: 'Scheduled',
    pendingDecisionTaskStartEventAttributes:
      pendingState && pendingStateToLabel[pendingState]
        ? pendingStateToLabel[pendingState]
        : pendingStateToLabel.PENDING_DECISION_STATE_SCHEDULED,
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

  const shownPendingEventTimePrefix = shownPendingEvent?.[pendingStartAttr]
    .startedTime
    ? 'Started at'
    : 'Scheduled at';

  const eventToNegativeFields: HistoryGroupEventToNegativeFieldsMap<DecisionHistoryGroup> =
    {
      decisionTaskFailedEventAttributes: ['reason', 'details', 'cause'],
      decisionTaskTimedOutEventAttributes: ['reason', 'cause'],
    };

  const eventToSummaryFields: HistoryGroupEventToSummaryFieldsMap<DecisionHistoryGroup> =
    {
      decisionTaskScheduledEventAttributes: ['attempt'],
      pendingDecisionTaskStartEventAttributes: ['attempt'],
      decisionTaskFailedEventAttributes: ['reason', 'details', 'cause'],
      decisionTaskTimedOutEventAttributes: ['reason', 'cause'],
    };

  return {
    label,
    hasMissingEvents,
    groupType,
    badges,
    resetToDecisionEventId,
    ...getCommonHistoryGroupFields<DecisionHistoryGroup>({
      events: finalEvents,
      historyGroupEventToStatusMap: eventToStatus,
      eventToLabelMap: eventToLabel,
      eventToTimeLabelPrefixMap: {
        pendingDecisionTaskStartEventAttributes: shownPendingEventTimePrefix,
      },
      closeEvent: closeEvent || timeoutEvent,
      eventToNegativeFieldsMap: eventToNegativeFields,
      eventToSummaryFieldsMap: eventToSummaryFields,
    }),
  };
}
