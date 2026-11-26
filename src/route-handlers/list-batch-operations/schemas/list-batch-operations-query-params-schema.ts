import { z } from 'zod';

import { BatchOperationState } from '@/__generated__/proto-ts/uber/cadence/api/v1/BatchOperationState';

const listBatchOperationsQueryParamsSchema = z.object({
  pageSize: z
    .string()
    .optional()
    .default('25')
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().positive({ message: 'Page size must be a positive integer' })
    ),
  nextPage: z.string().optional(),
  state: z
    .enum([
      BatchOperationState.BATCH_OPERATION_STATE_RUNNING,
      BatchOperationState.BATCH_OPERATION_STATE_COMPLETED,
      BatchOperationState.BATCH_OPERATION_STATE_FAILED,
      BatchOperationState.BATCH_OPERATION_STATE_STOPPED,
    ])
    .optional(),
});

export default listBatchOperationsQueryParamsSchema;
