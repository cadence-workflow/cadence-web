import { type PendingDecisionInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/PendingDecisionInfo';

import { type PendingDecisionTaskScheduleEvent } from '../workflow-history.types';

export default function pendingDecisionInfoToEvent(
  decisionInfo: PendingDecisionInfo
): PendingDecisionTaskScheduleEvent | null {
  if (decisionInfo?.state === 'PENDING_DECISION_STATE_SCHEDULED') {
    return {
      attributes: 'pendingDecisionTaskScheduleEventAttributes',
      eventId: decisionInfo.scheduleId,
      eventTime: decisionInfo.scheduledTime,
      pendingDecisionTaskScheduleEventAttributes: {
        ...decisionInfo,
        state: 'PENDING_DECISION_STATE_SCHEDULED', // make it clear to ts that the state is scheduled (same as a typeguard)
      },
    } satisfies PendingDecisionTaskScheduleEvent;
  }

  return null;
}
