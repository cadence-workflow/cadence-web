import type {
  ActivityHistoryEvent,
  ActivityHistoryGroup,
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getActivityGroupFromEvents(
  events: ActivityHistoryEvent[]
): ActivityHistoryGroup {
  let label = '';
  let hasMissingEvents = false;
  const groupType = 'Activity';
  const badges = [];

  const scheduleAttr = 'activityTaskScheduledEventAttributes';
  const startAttr = 'activityTaskStartedEventAttributes';
  const scheduleEvent = events.find(
    ({ attributes }) => attributes === scheduleAttr
  );
  const startEvent = events.find(({ attributes }) => attributes === startAttr);
  const firstEvent = events[0];

  if (scheduleEvent) {
    label = `Activity ${scheduleEvent[scheduleAttr]?.activityId}: ${scheduleEvent[scheduleAttr]?.activityType?.name}`;
  }
  if (startEvent && startEvent[startAttr]?.attempt) {
    const attempts = startEvent[startAttr].attempt;
    badges.push({
      content: `${attempts} Attempt${attempts !== 1 ? 's' : ''}`,
    });
  }
  if (firstEvent.attributes !== 'activityTaskScheduledEventAttributes') {
    hasMissingEvents = true;
  }

  const eventToLabel: HistoryGroupEventToStringMap<ActivityHistoryGroup> = {
    activityTaskScheduledEventAttributes: 'Scheduled',
    activityTaskStartedEventAttributes: 'Started',
    activityTaskCompletedEventAttributes: 'Completed',
    activityTaskFailedEventAttributes: 'Failed',
    activityTaskCanceledEventAttributes: 'Canceled',
    activityTaskTimedOutEventAttributes: 'Timed out',
  };

  const eventToStatus: HistoryGroupEventToStatusMap<ActivityHistoryGroup> = {
    activityTaskScheduledEventAttributes: (_, events, index) =>
      index < events.length - 1 ? 'COMPLETED' : 'WAITING',
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
      {}
    ),
  };
}
