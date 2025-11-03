import { z } from 'zod';

const listFailoverHistoryQueryParamsSchema = z.object({
  domainId: z.string(),
  nextPage: z.string().optional(),
});

export default listFailoverHistoryQueryParamsSchema;
