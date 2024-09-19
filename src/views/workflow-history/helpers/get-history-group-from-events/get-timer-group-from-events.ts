import type {
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  TimerHistoryEvent,
  TimerHistoryGroup,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getTimerGroupFromEvents(
  events: TimerHistoryEvent[]
): TimerHistoryGroup {
  const firstEvent = events[0];

  const label = `Timer ${firstEvent[firstEvent.attributes]?.timerId}`; // TODO add duration
  let hasMissingEvents = false;
  const groupType = 'Timer';

  if (firstEvent.attributes !== 'timerStartedEventAttributes') {
    hasMissingEvents = true;
  }
  const eventToLabel: HistoryGroupEventToStringMap<TimerHistoryGroup> = {
    timerStartedEventAttributes: 'Started',
    timerFiredEventAttributes: 'Fired',
    timerCanceledEventAttributes: 'Canceled',
  };
  const eventToStatus: HistoryGroupEventToStatusMap<TimerHistoryGroup> = {
    timerStartedEventAttributes: (_, events, index) =>
      index < events.length - 1 ? 'COMPLETED' : 'ONGOING',
    timerFiredEventAttributes: 'COMPLETED',
    timerCanceledEventAttributes: 'CANCELED',
  };

  return {
    label,
    hasMissingEvents,
    groupType,
    ...getCommonHistoryGroupFields<TimerHistoryGroup>(
      events,
      eventToStatus,
      eventToLabel,
      {}
    ),
  };
}
