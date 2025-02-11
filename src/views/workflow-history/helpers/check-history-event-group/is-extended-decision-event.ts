import type { ExtendedDecisionHistoryEvent } from '../../workflow-history.types';

export default function isExtendedDecisionEvent(event: {
  attributes: string;
}): event is ExtendedDecisionHistoryEvent {
  return [
    'pendingDecisionTaskScheduleEventAttributes',
    'decisionTaskScheduledEventAttributes',
    'decisionTaskStartedEventAttributes',
    'decisionTaskCompletedEventAttributes',
    'decisionTaskFailedEventAttributes',
    'decisionTaskTimedOutEventAttributes',
  ].includes(event?.attributes);
}
