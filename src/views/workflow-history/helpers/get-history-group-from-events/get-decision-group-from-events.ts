import type {
  DecisionHistoryEvent,
  DecisionHistoryGroup,
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getDecisionGroupFromEvents(
  events: DecisionHistoryEvent[]
): DecisionHistoryGroup {
  const label = 'Decision Task';
  let hasMissingEvents = false;
  const groupType = 'Decision';
  const badges = [];

  const firstEvent = events[0];
  const scheduleAttr = 'decisionTaskScheduledEventAttributes';
  const scheduleEvent = events.find(
    ({ attributes }) => attributes === scheduleAttr
  );
  if (firstEvent.attributes !== 'decisionTaskScheduledEventAttributes') {
    hasMissingEvents = true;
  }

  if (scheduleEvent && scheduleEvent[scheduleAttr]?.attempt) {
    const attempts = scheduleEvent[scheduleAttr].attempt;
    badges.push({
      content: `${attempts + 1} Attempts`,
    });
  }
  const eventToLabel: HistoryGroupEventToStringMap<DecisionHistoryGroup> = {
    decisionTaskScheduledEventAttributes: 'Scheduled',
    decisionTaskStartedEventAttributes: 'Started',
    decisionTaskCompletedEventAttributes: 'Completed',
    decisionTaskFailedEventAttributes: 'Failed',
    decisionTaskTimedOutEventAttributes: 'Timed out',
  };
  const eventToStatus: HistoryGroupEventToStatusMap<DecisionHistoryGroup> = {
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
      {}
    ),
  };
}
