import { type PendingDecisionTaskStartEvent } from '../workflow-history.types';

export default function isRetryingPendingDecision(
  pending: PendingDecisionTaskStartEvent
): boolean {
  return pending.pendingDecisionTaskStartEventAttributes.attempt > 0;
}
