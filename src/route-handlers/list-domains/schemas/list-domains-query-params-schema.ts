import { z } from 'zod';

import { MAX_DOMAINS_TO_FETCH } from '../list-domains.constants';

const listDomainsQueryParamsSchema = z.object({
  pageSize: z
    .string()
    .optional()
    .default(String(MAX_DOMAINS_TO_FETCH))
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().positive({ message: 'Page size must be a positive integer' })
    ),
  nextPage: z.string().optional(),
});

export default listDomainsQueryParamsSchema;
