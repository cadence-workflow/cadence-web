import { z } from 'zod';

import validateArchivedQueryParams from '@/route-handlers/shared/helpers/validate-archived-query-params';
import visibilityQuerySchema from '@/route-handlers/shared/schemas/visibility-query-schema';

const listWorkflowsQueryParamSchema = visibilityQuerySchema
  .merge(
    z.object({
      pageSize: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(
          z
            .number()
            .positive({ message: 'Page size must be a positive integer' })
        ),
      nextPage: z.string().optional(),
    })
  )
  .superRefine(validateArchivedQueryParams);

export default listWorkflowsQueryParamSchema;
