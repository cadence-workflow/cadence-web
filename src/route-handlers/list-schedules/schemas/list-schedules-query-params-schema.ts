import { z } from 'zod';

const listSchedulesQueryParamsSchema = z.object({
  pageSize: z
    .string()
    .optional()
    .default('25')
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().positive({ message: 'Page size must be a positive integer' })
    ),
  nextPage: z.string().optional(),
});

export default listSchedulesQueryParamsSchema;
