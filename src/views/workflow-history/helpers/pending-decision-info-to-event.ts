import { type PendingDecisionInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/PendingDecisionInfo';

import { type PendingDecisionTaskStartEvent } from '../workflow-history.types';

export default function pendingDecisionInfoToEvent(
  decisionInfo: PendingDecisionInfo
): PendingDecisionTaskStartEvent | null {
  switch (decisionInfo.state) {
    case 'PENDING_DECISION_STATE_SCHEDULED':
    case 'PENDING_DECISION_STATE_STARTED':
      return {
        attributes: 'pendingDecisionTaskStartEventAttributes',
        eventId: null,
        computedEventId: `Pending-${decisionInfo.scheduleId}`,
        eventTime: decisionInfo.startedTime ?? decisionInfo.scheduledTime,
        pendingDecisionTaskStartEventAttributes: {
          ...decisionInfo,
          state: decisionInfo.state, // make it clear to ts that the state is scheduled or started (same as a typeguard)
        },
      } satisfies PendingDecisionTaskStartEvent;
    default:
      return null;
  }
}
