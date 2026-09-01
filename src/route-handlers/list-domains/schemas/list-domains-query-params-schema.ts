import { z } from 'zod';

const listDomainsQueryParamsSchema = z.object({
  pageSize: z.coerce
    .number()
    .int()
    .positive({ message: 'Page size must be a positive integer' }),
  nextPage: z.string().optional(),
});

export default listDomainsQueryParamsSchema;
