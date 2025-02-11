import type {
  ActivityHistoryGroup,
  ExtendedActivityHistoryEvent,
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getActivityGroupFromEvents(
  events: ExtendedActivityHistoryEvent[]
): ActivityHistoryGroup {
  let label = '';
  let hasMissingEvents = false;
  const groupType = 'Activity';
  const badges = [];

  const scheduleAttr = 'activityTaskScheduledEventAttributes';
  const startAttr = 'activityTaskStartedEventAttributes';
  const pendingStartAttr = 'pendingActivityTaskStartEventAttributes';

  let scheduleEvent: ExtendedActivityHistoryEvent | undefined;
  let startEvent: ExtendedActivityHistoryEvent | undefined;
  let pendingStartEvent: ExtendedActivityHistoryEvent | undefined;

  events.forEach((e) => {
    if (e.attributes === scheduleAttr) scheduleEvent = e;
    if (e.attributes === startAttr) startEvent = e;
    if (e.attributes === pendingStartAttr) pendingStartEvent = e;
  });

  const firstEvent = events[0];

  // getting group label
  if (scheduleEvent && scheduleAttr in scheduleEvent) {
    label = `Activity ${scheduleEvent[scheduleAttr]?.activityId}: ${scheduleEvent[scheduleAttr]?.activityType?.name}`;
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

  // checking for missing events
  if (firstEvent.attributes !== 'activityTaskScheduledEventAttributes') {
    hasMissingEvents = true;
  }

  const eventToLabel: HistoryGroupEventToStringMap<ActivityHistoryGroup> = {
    activityTaskScheduledEventAttributes: 'Scheduled',
    pendingActivityTaskStartEventAttributes: 'Starting',
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

  return {
    label,
    hasMissingEvents,
    groupType,
    badges,
    ...getCommonHistoryGroupFields<ActivityHistoryGroup>(
      events,
      eventToStatus,
      eventToLabel,
      { pendingActivityTaskStartEventAttributes: 'Last started at' }
    ),
  };
}
