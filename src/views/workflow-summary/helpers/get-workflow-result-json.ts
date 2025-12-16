import {
  type FormattedHistoryEventForType,
  type FormattedHistoryEvent,
} from '@/utils/data-formatters/schema/format-history-event-schema';

export default function getWorkflowResultJson(
  formattedEvent: FormattedHistoryEvent
) {
  const eventType = formattedEvent.eventType;
  if (eventType === 'WorkflowExecutionFailed') {
    const { reason, details } = formattedEvent;
    return { reason, details };
  }
  if (eventType === 'WorkflowExecutionTerminated') {
    const { details, reason, identity } = formattedEvent;
    return { reason, details, identity };
  }

  if (eventType === 'WorkflowExecutionContinuedAsNew') {
    const { initiator, failureDetails, failureReason, lastCompletionResult } =
      formattedEvent;
    const result: Partial<
      Pick<
        FormattedHistoryEventForType<'WorkflowExecutionContinuedAsNew'>,
        | 'initiator'
        | 'lastCompletionResult'
        | 'failureDetails'
        | 'failureReason'
      >
    > = {
      initiator,
      lastCompletionResult,
    };
    // only add failure fields if it was failed not to confuse user
    if (failureDetails || failureReason) {
      result.failureDetails = failureDetails;
      result.failureReason = failureReason;
    }
    return result;
  }

  if (eventType === 'WorkflowExecutionTimedOut') {
    const { timeoutType } = formattedEvent;
    return { timeoutType };
  }

  if (eventType === 'WorkflowExecutionCanceled') {
    return formattedEvent.details;
  }

  if (eventType === 'WorkflowExecutionCompleted') return formattedEvent.result;

  return undefined;
}
