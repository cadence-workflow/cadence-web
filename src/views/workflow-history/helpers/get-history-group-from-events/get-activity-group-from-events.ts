import formatPayload from '@/utils/data-formatters/format-payload';
import formatTimestampToDatetime from '@/utils/data-formatters/format-timestamp-to-datetime';

import WORKFLOW_HISTORY_SHOULD_SHORTEN_GROUP_LABELS_CONFIG from '../../config/workflow-history-should-shorten-group-labels.config';
import type {
  ActivityHistoryGroup,
  ExtendedActivityHistoryEvent,
  HistoryGroupEventToNegativeFieldsMap,
  HistoryGroupEventToSummaryFieldsMap,
  HistoryGroupEventToAdditionalDetailsMap,
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  PendingActivityTaskStartEvent,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getActivityGroupFromEvents(
  events: ExtendedActivityHistoryEvent[]
): ActivityHistoryGroup {
  let label = '';
  let shortLabel = undefined;
  const groupType = 'Activity';
  const badges = [];

  const scheduleAttr = 'activityTaskScheduledEventAttributes';
  const timeoutAttr = 'activityTaskTimedOutEventAttributes';
  const startAttr = 'activityTaskStartedEventAttributes';
  const pendingStartAttr = 'pendingActivityTaskStartEventAttributes';
  const closeAttrs = [
    'activityTaskCompletedEventAttributes',
    'activityTaskFailedEventAttributes',
    'activityTaskCanceledEventAttributes',
  ];

  let scheduleEvent: ExtendedActivityHistoryEvent | undefined;
  let timeoutEvent: ExtendedActivityHistoryEvent | undefined;
  let startEvent: ExtendedActivityHistoryEvent | undefined;
  let pendingStartEvent: PendingActivityTaskStartEvent | undefined;
  let closeEvent: ExtendedActivityHistoryEvent | undefined;

  events.forEach((e) => {
    if (e.attributes === scheduleAttr) scheduleEvent = e;
    if (e.attributes === timeoutAttr) timeoutEvent = e;
    if (e.attributes === startAttr) startEvent = e;
    if (e.attributes === pendingStartAttr) pendingStartEvent = e;
    if (closeAttrs.includes(e.attributes)) closeEvent = e;
  });

  const hasAllTimeoutEvents = scheduleEvent && timeoutEvent;
  const hasAllCloseEvents = scheduleEvent && startEvent && closeEvent;
  const hasMissingEvents = !hasAllTimeoutEvents && !hasAllCloseEvents;

  // getting group label
  if (scheduleEvent && scheduleAttr in scheduleEvent) {
    const activityName = scheduleEvent[scheduleAttr]?.activityType?.name;
    const activityId = scheduleEvent[scheduleAttr]?.activityId;
    label = `Activity ${activityId}: ${activityName}`;

    if (
      WORKFLOW_HISTORY_SHOULD_SHORTEN_GROUP_LABELS_CONFIG &&
      activityName?.includes('.')
    ) {
      shortLabel = `Activity ${activityId}: ${(activityName || '')
        .split(/[./]/g)
        .pop()}`;
    }
  }

  // getting retry badge
  let retryAttemptNumber = 0;
  if (
    pendingStartEvent &&
    pendingStartAttr in pendingStartEvent &&
    pendingStartEvent[pendingStartAttr]?.attempt
  ) {
    retryAttemptNumber = pendingStartEvent[pendingStartAttr].attempt;
  }

  if (startEvent && startAttr in startEvent && startEvent[startAttr]?.attempt) {
    retryAttemptNumber = startEvent[startAttr].attempt;
  }

  if (retryAttemptNumber) {
    badges.push({
      content:
        retryAttemptNumber === 1 ? '1 Retry' : `${retryAttemptNumber} Retries`,
    });
  }

  const pendingStateToLabel: Record<
    PendingActivityTaskStartEvent['pendingActivityTaskStartEventAttributes']['state'],
    string
  > = {
    PENDING_ACTIVITY_STATE_SCHEDULED: 'Starting',
    PENDING_ACTIVITY_STATE_STARTED: 'Running',
    PENDING_ACTIVITY_STATE_CANCEL_REQUESTED: 'Cancelling',
  };

  const pendingState = pendingStartEvent?.[pendingStartAttr].state;

  const eventToLabel: HistoryGroupEventToStringMap<ActivityHistoryGroup> = {
    activityTaskScheduledEventAttributes: 'Scheduled',
    pendingActivityTaskStartEventAttributes:
      pendingState && pendingStateToLabel[pendingState]
        ? pendingStateToLabel[pendingState]
        : pendingStateToLabel.PENDING_ACTIVITY_STATE_SCHEDULED,
    activityTaskStartedEventAttributes: 'Started',
    activityTaskCompletedEventAttributes: 'Completed',
    activityTaskFailedEventAttributes: 'Failed',
    activityTaskCanceledEventAttributes: 'Canceled',
    activityTaskTimedOutEventAttributes: 'Timed out',
  };

  const eventToStatus: HistoryGroupEventToStatusMap<ActivityHistoryGroup> = {
    activityTaskScheduledEventAttributes: (_, events, index) =>
      index < events.length - 1 ? 'COMPLETED' : 'WAITING',
    pendingActivityTaskStartEventAttributes: 'WAITING',
    activityTaskStartedEventAttributes: (_, events, index) =>
      index < events.length - 1 ? 'COMPLETED' : 'ONGOING',
    activityTaskCompletedEventAttributes: 'COMPLETED',
    activityTaskFailedEventAttributes: 'FAILED',
    activityTaskCanceledEventAttributes: 'CANCELED',
    activityTaskTimedOutEventAttributes: 'FAILED',
  };

  const eventToNegativeFields: HistoryGroupEventToNegativeFieldsMap<ActivityHistoryGroup> =
    {
      activityTaskFailedEventAttributes: ['reason', 'details'],
      activityTaskTimedOutEventAttributes: ['reason', 'details'],
      pendingActivityTaskStartEventAttributes: [
        'lastFailureReason',
        'lastFailureDetails',
      ],
    };

  const pendingStartEventTimePrefix = pendingStartEvent?.[pendingStartAttr]
    .lastStartedTime
    ? 'Last started at'
    : 'Scheduled at';

  const eventToAdditionalDetails: HistoryGroupEventToAdditionalDetailsMap<ActivityHistoryGroup> =
    {
      ...(pendingStartEvent
        ? {
            activityTaskStartedEventAttributes: {
              lastHeartbeatTime: formatTimestampToDatetime(
                pendingStartEvent.pendingActivityTaskStartEventAttributes
                  .lastHeartbeatTime
              ),
              heartbeatDetails: formatPayload(
                pendingStartEvent.pendingActivityTaskStartEventAttributes
                  .heartbeatDetails
              ),
            },
          }
        : {}),
    };

  const eventToSummaryFields: HistoryGroupEventToSummaryFieldsMap<ActivityHistoryGroup> =
    {
      activityTaskScheduledEventAttributes: [
        'input',
        'scheduleToCloseTimeoutSeconds',
      ],
      pendingActivityTaskStartEventAttributes: [
        'lastFailureReason',
        'lastFailureDetails',
        'attempt',
      ],
      activityTaskStartedEventAttributes: [
        'heartbeatDetails',
        'lastHeartbeatTime',
        'attempt',
      ],
      activityTaskCompletedEventAttributes: ['result'],
      activityTaskFailedEventAttributes: ['details', 'reason'],
    };

  const shouldShowPendingEvent = Boolean(
    scheduleEvent &&
      pendingStartEvent &&
      !(startEvent || closeEvent || timeoutEvent)
  );

  const finalEvents = shouldShowPendingEvent
    ? events
    : events.filter(
        (e) => e.attributes !== 'pendingActivityTaskStartEventAttributes'
      );

  return {
    label,
    shortLabel,
    hasMissingEvents,
    groupType,
    badges,
    ...getCommonHistoryGroupFields<ActivityHistoryGroup>(
      finalEvents,
      eventToStatus,
      eventToLabel,
      { pendingActivityTaskStartEventAttributes: pendingStartEventTimePrefix },
      closeEvent || timeoutEvent,
      eventToNegativeFields,
      eventToAdditionalDetails,
      eventToSummaryFields
    ),
  };
}
