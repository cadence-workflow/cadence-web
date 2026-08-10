import { z } from 'zod';

import { BATCH_ACTION_TYPE } from '../describe-batch-action.constants';

const batcherInputSchema = z
  .object({
    BatchType: z.nativeEnum(BATCH_ACTION_TYPE).optional(),
    RPS: z.number().optional(),
    Query: z.string().optional(),
  })
  .transform(({ BatchType, RPS, Query }) => ({
    actionType: BatchType,
    rps: RPS, // TODO: Get latest RPS value if it was updated mid flight
    query: Query,
  }));

export default batcherInputSchema;
