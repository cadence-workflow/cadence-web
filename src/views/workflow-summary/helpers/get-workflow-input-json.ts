import { type FormattedHistoryEventForType } from '@/utils/data-formatters/schema/format-history-event-schema';

export default function getWorkflowInputJson(
  startEvent:
    | Pick<
        Partial<FormattedHistoryEventForType<'WorkflowExecutionStarted'>>,
        'input'
      >
    | undefined
): unknown {
  return startEvent && 'input' in startEvent ? startEvent.input : [];
}
