import { type PendingDecisionTaskStartEvent } from '../workflow-history.types';

// attempt is the server's DecisionAttempt. It is 0 on the first try and
// increases each time the decision fails or times out.
export default function isRetryingPendingDecision(
  pending: PendingDecisionTaskStartEvent
): boolean {
  return pending.pendingDecisionTaskStartEventAttributes.attempt > 0;
}
