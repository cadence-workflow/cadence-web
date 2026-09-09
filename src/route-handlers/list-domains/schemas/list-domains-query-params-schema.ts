import { z } from 'zod';

const listDomainsQueryParamsSchema = z.object({
  pageSize: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().positive({ message: 'Page size must be a positive integer' })
    ),
  nextPage: z.string().optional(),
});

export default listDomainsQueryParamsSchema;
