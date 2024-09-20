import { z } from 'zod';

const getWorkflowHistoryQueryParamSchema = z.object({
  pageSize: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().positive({ message: 'Page size must be a positive integer' })
    ),
  nextPage: z.string().optional(),
  waitForNewEvent: z
    .string()
    .toLowerCase()
    .transform((x) => x === 'true')
    .pipe(z.boolean())
    .optional(),
});

export default getWorkflowHistoryQueryParamSchema;
