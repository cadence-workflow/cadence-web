import type { ExtendedActivityHistoryEvent } from '../../workflow-history-v2.types';

export default function isExtendedActivityEvent(event: {
  attributes: string;
}): event is ExtendedActivityHistoryEvent {
  return [
    'activityTaskScheduledEventAttributes',
    'pendingActivityTaskStartEventAttributes',
    'activityTaskStartedEventAttributes',
    'activityTaskCompletedEventAttributes',
    'activityTaskFailedEventAttributes',
    'activityTaskTimedOutEventAttributes',
    'activityTaskCanceledEventAttributes',
  ].includes(event?.attributes);
}
