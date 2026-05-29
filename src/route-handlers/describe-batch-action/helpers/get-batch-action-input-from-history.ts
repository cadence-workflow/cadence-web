import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';
import formatInputPayload from '@/utils/data-formatters/format-input-payload';
import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

import { BATCH_ACTION_TYPE } from '../describe-batch-action.constants';
import { type BatchActionType } from '../describe-batch-action.types';

const isBatchActionType = (value: string): value is BatchActionType =>
  value in BATCH_ACTION_TYPE;

type BatcherInputFields = Pick<
  BatchAction,
  'actionType' | 'rps' | 'concurrency'
>;

export default function getBatchActionInputFromHistory(
  history: GetWorkflowExecutionHistoryResponse
): BatcherInputFields {
  const startedEvent =
    history.history?.events?.[0]?.workflowExecutionStartedEventAttributes;
  if (!startedEvent?.input) return {};

  const parsed = formatInputPayload(startedEvent.input);
  if (!Array.isArray(parsed) || parsed.length === 0) return {};

  // Batcher input is a single struct; some SDKs wrap it in an extra array.
  const candidate =
    Array.isArray(parsed[0]) && parsed[0].length === 1
      ? parsed[0][0]
      : parsed[0];
  if (typeof candidate !== 'object' || candidate === null) return {};

  const params = candidate as Record<string, unknown>;
  const rawBatchType = params.BatchType;
  const rawRps = params.RPS;
  const rawConcurrency = params.Concurrency;

  const normalizedBatchType =
    typeof rawBatchType === 'string' ? rawBatchType.toLowerCase() : undefined;

  return {
    actionType:
      normalizedBatchType && isBatchActionType(normalizedBatchType)
        ? normalizedBatchType
        : undefined,
    rps: typeof rawRps === 'number' ? rawRps : undefined, // TODO: Get latest RPS value if it was updated mid flight
    concurrency:
      typeof rawConcurrency === 'number' ? rawConcurrency : undefined,
  };
}
