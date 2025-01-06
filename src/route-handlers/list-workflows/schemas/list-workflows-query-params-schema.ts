import { z } from 'zod';

import { SORT_ORDERS } from '@/utils/sort-by';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

const listWorkflowsQueryParamSchema = z
  .object({
    pageSize: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(
        z.number().positive({ message: 'Page size must be a positive integer' })
      ),
    listType: z.enum(['default', 'archived']),
    inputType: z.enum(['search', 'query']),
    search: z.string().optional(),
    query: z.string().optional(),
    status: z
      .custom<WorkflowStatus>(isWorkflowStatus, {
        message: 'Invalid workflow status',
      })
      .optional(),
    cron: z.enum(['CRON', 'NON_CRON']).optional(),
    timeColumn: z
      .enum(['StartTime', 'CloseTime'])
      .optional()
      .default('StartTime'),
    timeRangeStart: z.string().datetime().optional(),
    timeRangeEnd: z.string().datetime().optional(),
    sortColumn: z.string().optional(),
    sortOrder: z
      .enum(SORT_ORDERS, { message: 'Invalid sort order' })
      .optional(),
    nextPage: z.string().optional(),
  })
  .superRefine((queryParams, ctx) => {
    if (
      queryParams.listType === 'archived' &&
      queryParams.inputType === 'search'
    ) {
      if (queryParams.timeColumn === 'StartTime') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Cannot search for archived workflows by start time',
        });
      }

      if (!queryParams.timeRangeStart || !queryParams.timeRangeEnd) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Start and End time need to be passed for searching archived workflows',
        });
      }
    }
  });

export default listWorkflowsQueryParamSchema;
