import { z } from 'zod';

import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';
import formatInputPayload from '@/utils/data-formatters/format-input-payload';

import { BATCH_ACTION_TYPE } from '../describe-batch-action.constants';
import { type BatcherInputFields } from '../describe-batch-action.types';

// The batcher's start input is a single struct. We read it leniently: each field
// degrades to `undefined` if it is missing or the wrong type, and BatchType is
// matched case-insensitively against the supported action types. zod keeps the
// runtime checks and the inferred output type in lockstep.
const batcherInputSchema = z
  .object({
    BatchType: z
      .string()
      .transform((value) => value.toLowerCase())
      .pipe(z.nativeEnum(BATCH_ACTION_TYPE))
      .optional()
      .catch(undefined),
    RPS: z.number().optional().catch(undefined),
    Concurrency: z.number().optional().catch(undefined),
  })
  .transform(({ BatchType, RPS, Concurrency }) => ({
    actionType: BatchType,
    rps: RPS, // TODO: Get latest RPS value if it was updated mid flight
    concurrency: Concurrency,
  }));

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

  const result = batcherInputSchema.safeParse(candidate);
  return result.success ? result.data : null;
}
