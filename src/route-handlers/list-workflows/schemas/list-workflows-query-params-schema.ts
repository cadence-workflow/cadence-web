import { z } from 'zod';

import { SORT_ORDERS } from '@/utils/sort-by';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';
import getTimestampNsFromISO from '@/utils/datetime/get-timestamp-ns-from-iso';

const listWorkflowsQueryParamSchema = z.object({
  pageSize: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().positive({ message: 'Page size must be a positive integer' })
    ),
  search: z.string().optional(),
  status: z
    // TODO @adhitya.mamallan - convert this to an enum when the GRPC type is ready
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
