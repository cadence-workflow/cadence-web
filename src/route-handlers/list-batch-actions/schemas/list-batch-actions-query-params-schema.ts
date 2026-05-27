import { z } from 'zod';

const listBatchActionsQueryParamsSchema = z.object({
  pageSize: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().positive({ message: 'Page size must be a positive integer' })
    ),
  nextPage: z.string().optional(),
});

export default listBatchActionsQueryParamsSchema;
