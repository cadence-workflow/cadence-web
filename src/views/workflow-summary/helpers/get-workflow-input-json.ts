import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import { type FormattedHistoryEventForType } from '@/utils/data-formatters/schema/format-history-event-schema';

export default function getWorkflowInputJson(
  startEvent:
    | FormattedHistoryEventForType<'WorkflowExecutionStarted'>
    | undefined
): PrettyJsonValue {
  return startEvent && 'input' in startEvent
    ? (startEvent.input as PrettyJsonValue)
    : [];
}
