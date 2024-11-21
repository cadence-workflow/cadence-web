import { z } from 'zod';

import getTimestampNsFromISO from '@/utils/datetime/get-timestamp-ns-from-iso';
import { SORT_ORDERS } from '@/utils/sort-by';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

const listWorkflowsQueryParamSchema = z.object({
  pageSize: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().positive({ message: 'Page size must be a positive integer' })
    ),
  inputType: z.enum(['search', 'query']),
  search: z.string().optional(),
  query: z.string().optional(),
  status: z
    .custom<WorkflowStatus>(isWorkflowStatus, {
      message: 'Invalid workflow status',
    })
    .optional(),
  timeRangeStart: z
    .string()
    .datetime()
    .transform(getTimestampNsFromISO)
    .optional(),
  timeRangeEnd: z
    .string()
    .datetime()
    .transform(getTimestampNsFromISO)
    .optional(),
  sortColumn: z.string().optional(),
  sortOrder: z.enum(SORT_ORDERS, { message: 'Invalid sort order' }).optional(),
  nextPage: z.string().optional(),
});

export default listWorkflowsQueryParamSchema;
