import { type PendingDecisionTaskStartEvent } from '../workflow-history.types';

// ponytail: PendingDecision.attempt is the server's DecisionAttempt retry
// generation (increments on fail/timeout replication; sticky schedule-to-start
// requeue uses FailDecision(false) and does not increment). If server semantics
// change, this is the one place to fix.
export default function isRetryingPendingDecision(
  pending: PendingDecisionTaskStartEvent
): boolean {
  return pending.pendingDecisionTaskStartEventAttributes.attempt > 0;
}
