import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import type { DecisionHistoryEvent } from '../../workflow-history.types';

export default function isDecisionEvent(
  event: Pick<HistoryEvent, 'attributes'>
): event is DecisionHistoryEvent {
  return [
    'decisionTaskScheduledEventAttributes',
    'decisionTaskStartedEventAttributes',
    'decisionTaskCompletedEventAttributes',
    'decisionTaskFailedEventAttributes',
    'decisionTaskTimedOutEventAttributes',
  ].includes(event?.attributes);
}
