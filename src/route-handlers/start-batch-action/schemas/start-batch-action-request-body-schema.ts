import { z } from 'zod';

import { BATCH_ACTION_TYPE } from '@/route-handlers/describe-batch-action/describe-batch-action.constants';
import signalWorkflowRequestBodySchema from '@/route-handlers/signal-workflow/schemas/signal-workflow-request-body-schema';
import { rpsSchema } from '@/views/domain-batch-actions/schemas/rps-schema';

const commonFields = {
  query: z.string().min(1),
  reason: z.string().min(1),
  rps: rpsSchema,
  batchId: z.string().min(1).optional(),
};

const startBatchActionRequestBodySchema = z.discriminatedUnion('batchType', [
  z.object({
    ...commonFields,
    batchType: z.literal(BATCH_ACTION_TYPE.terminate),
  }),
  z.object({
    ...commonFields,
    batchType: z.literal(BATCH_ACTION_TYPE.cancel),
  }),
  z.object({
    ...commonFields,
    batchType: z.literal(BATCH_ACTION_TYPE.signal),
    signalParams: signalWorkflowRequestBodySchema,
  }),
]);

export default startBatchActionRequestBodySchema;
