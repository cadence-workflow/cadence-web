import { type FormattedHistoryEvent } from '@/utils/data-formatters/schema/format-history-event-schema';

export default function getWorkflowResultJson(
  formattedEvent: FormattedHistoryEvent
) {
  const eventType = formattedEvent.eventType;
  if (
    eventType === 'WorkflowExecutionCanceled' ||
    eventType === 'WorkflowExecutionFailed' ||
    eventType === 'WorkflowExecutionTerminated'
  )
    return formattedEvent.details;

  if (eventType === 'WorkflowExecutionCompleted') return formattedEvent.result;

  return undefined;
}
