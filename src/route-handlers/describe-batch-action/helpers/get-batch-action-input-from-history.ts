import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';
import formatInputPayload from '@/utils/data-formatters/format-input-payload';

import { type BatcherInputFields } from '../describe-batch-action.types';
import batcherInputSchema from '../schemas/batcher-input-schema';

export default function getBatchActionInputFromHistory(
  history: GetWorkflowExecutionHistoryResponse
): BatcherInputFields | null {
  const startedEvent =
    history.history?.events?.[0]?.workflowExecutionStartedEventAttributes;
  if (!startedEvent?.input) return null;

  const parsed = formatInputPayload(startedEvent.input);
  if (!Array.isArray(parsed) || parsed.length === 0) return null;

  // Batcher input is a single struct; some SDKs wrap it in an extra array.
  const candidate =
    Array.isArray(parsed[0]) && parsed[0].length === 1
      ? parsed[0][0]
      : parsed[0];

  // Throws on malformed input (caught and surfaced as an error by the handler);
  // absent input is handled by the early returns above.
  return batcherInputSchema.parse(candidate);
}
