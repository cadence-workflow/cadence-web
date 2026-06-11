import { z } from 'zod';

import { BATCH_ACTION_TYPE } from '../describe-batch-action.constants';

const batcherInputSchema = z
  .object({
    BatchType: z.nativeEnum(BATCH_ACTION_TYPE).optional(),
    RPS: z.number().optional(),
    Concurrency: z.number().optional(),
  })
  .transform(({ BatchType, RPS, Concurrency }) => ({
    actionType: BatchType,
    rps: RPS, // TODO: Get latest RPS value if it was updated mid flight
    concurrency: Concurrency,
  }));

export default batcherInputSchema;
