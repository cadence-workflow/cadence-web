import type { ExtendedDecisionHistoryEvent } from '../../workflow-history-v2.types';

export default function isExtendedDecisionEvent(event: {
  attributes: string;
}): event is ExtendedDecisionHistoryEvent {
  return [
    'pendingDecisionTaskStartEventAttributes',
    'decisionTaskScheduledEventAttributes',
    'decisionTaskStartedEventAttributes',
    'decisionTaskCompletedEventAttributes',
    'decisionTaskFailedEventAttributes',
    'decisionTaskTimedOutEventAttributes',
  ].includes(event?.attributes);
}
