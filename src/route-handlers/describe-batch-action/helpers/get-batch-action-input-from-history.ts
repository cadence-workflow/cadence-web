import isNumber from 'lodash/isNumber';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';

import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';
import formatInputPayload from '@/utils/data-formatters/format-input-payload';

import { BATCH_ACTION_TYPE } from '../describe-batch-action.constants';
import {
  type BatchActionType,
  type BatcherInputFields,
} from '../describe-batch-action.types';

const isBatchActionType = (value: string): value is BatchActionType =>
  value in BATCH_ACTION_TYPE;

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
  if (!isPlainObject(candidate)) return null;

  const params = candidate as Record<string, unknown>;
  const rawBatchType = params.BatchType;
  const rawRps = params.RPS;
  const rawConcurrency = params.Concurrency;

  const normalizedBatchType = isString(rawBatchType)
    ? rawBatchType.toLowerCase()
    : undefined;

  return {
    actionType:
      normalizedBatchType && isBatchActionType(normalizedBatchType)
        ? normalizedBatchType
        : undefined,
    rps: isNumber(rawRps) ? rawRps : undefined, // TODO: Get latest RPS value if it was updated mid flight
    concurrency: isNumber(rawConcurrency) ? rawConcurrency : undefined,
  };
}
