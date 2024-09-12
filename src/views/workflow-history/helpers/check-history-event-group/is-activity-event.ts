import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import type { ActivityHistoryEvent } from '../../workflow-history.types';

export default function isActivityEvent(
  event: Pick<HistoryEvent, 'attributes'>
): event is ActivityHistoryEvent {
  return [
    'activityTaskScheduledEventAttributes',
    'activityTaskStartedEventAttributes',
    'activityTaskCompletedEventAttributes',
    'activityTaskFailedEventAttributes',
    'activityTaskTimedOutEventAttributes',
    'activityTaskCanceledEventAttributes',
  ].includes(event?.attributes);
}
