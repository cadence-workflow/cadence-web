import type { TimerHistoryEvent } from '../../workflow-history-v2.types';

export default function isTimerEvent(event: {
  attributes: string;
}): event is TimerHistoryEvent {
  return [
    'timerStartedEventAttributes',
    'timerFiredEventAttributes',
    'timerCanceledEventAttributes',
  ].includes(event?.attributes);
}
