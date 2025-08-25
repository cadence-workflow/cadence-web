import type {
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  HistoryGroupEventToSummaryFieldsMap,
  TimerHistoryEvent,
  TimerHistoryGroup,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getTimerGroupFromEvents(
  events: TimerHistoryEvent[]
): TimerHistoryGroup {
  const firstEvent = events[0];

  const label = `Timer ${firstEvent[firstEvent.attributes]?.timerId}`; // TODO add duration
  const groupType = 'Timer';

  const startedAttr = 'timerStartedEventAttributes';

  const closeAttrs = [
    'timerFiredEventAttributes',
    'timerCanceledEventAttributes',
  ];

  let startedEvent: TimerHistoryEvent | undefined;
  let closeEvent: TimerHistoryEvent | undefined;

  events.forEach((e) => {
    if (e.attributes === startedAttr) startedEvent = e;
    if (closeAttrs.includes(e.attributes)) closeEvent = e;
  });

  const hasMissingEvents = !startedEvent || !closeEvent;

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

  const eventToSummaryFields: HistoryGroupEventToSummaryFieldsMap<TimerHistoryGroup> =
    {
      timerStartedEventAttributes: ['startToFireTimeoutSeconds'],
    };

  return {
    label,
    hasMissingEvents,
    groupType,
    ...getCommonHistoryGroupFields<TimerHistoryGroup>(
      events,
      eventToStatus,
      eventToLabel,
      {},
      closeEvent,
      undefined,
      undefined,
      eventToSummaryFields
    ),
  };
}
