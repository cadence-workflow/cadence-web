import { z } from 'zod';

import { SORT_ORDERS } from '@/utils/sort-by';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import validateArchivedQueryParams from '../helpers/validate-archived-query-params';

const workflowStatusSchema = z.custom<WorkflowStatus>(isWorkflowStatus, {
  message: 'Invalid workflow status',
});

export const visibilityQuerySchema = z.object({
  listType: z.enum(['default', 'archived']),
  inputType: z.enum(['search', 'query']),
  search: z
    .string()
    .trim()
    .optional()
    .transform((search) =>
      search === undefined
        ? undefined
        : search.replace(/['"]/g, (match) => `\\${match}`)
    ),
  query: z.string().optional(),
  statuses: z
    .union([
      workflowStatusSchema.transform((status) => [status]),
      z.array(workflowStatusSchema),
    ])
    .optional(),
  timeColumn: z
    .enum(['StartTime', 'CloseTime'])
    .optional()
    .default('StartTime'),
  timeRangeStart: z.string().datetime().optional(),
  timeRangeEnd: z.string().datetime().optional(),
  sortColumn: z.string().optional(),
  sortOrder: z.enum(SORT_ORDERS, { message: 'Invalid sort order' }).optional(),
});

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
