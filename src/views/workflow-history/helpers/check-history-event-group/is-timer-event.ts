import type { TimerHistoryEvent } from '../../workflow-history.types';

export default function isTimerEvent(event: {
  attributes: string;
}): event is TimerHistoryEvent {
  return [
    'timerStartedEventAttributes',
    'timerFiredEventAttributes',
    'timerCanceledEventAttributes',
  ].includes(event?.attributes);
}
