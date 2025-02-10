import type { ExtendedActivityHistoryEvent } from '../../workflow-history.types';

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
