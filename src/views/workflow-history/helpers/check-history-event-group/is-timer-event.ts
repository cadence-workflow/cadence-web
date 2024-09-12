import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import type { TimerHistoryEvent } from '../../workflow-history.types';

export default function isTimerEvent(
  event: Pick<HistoryEvent, 'attributes'>
): event is TimerHistoryEvent {
  return [
    'timerStartedEventAttributes',
    'timerFiredEventAttributes',
    'timerCanceledEventAttributes',
  ].includes(event?.attributes);
}
