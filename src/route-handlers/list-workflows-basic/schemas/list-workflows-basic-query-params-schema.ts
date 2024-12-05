import { z } from 'zod';

import getGrpcTimestampFromIso from '@/utils/datetime/get-grpc-timestamp-from-iso';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

const listWorkflowsBasicQueryParamsSchema = z.object({
  kind: z.enum(['open', 'closed']),
  pageSize: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().positive({ message: 'Page size must be a positive integer' })
    ),
  workflowId: z.string().optional(),
  workflowType: z.string().optional(),
  runId: z.string().optional(),
  closeStatus: z
    .custom<WorkflowStatus>(isWorkflowStatus, {
      message: 'Invalid workflow status',
    })
    .optional(),
  timeRangeStart: z.string().datetime().transform(getGrpcTimestampFromIso),
  timeRangeEnd: z.string().datetime().transform(getGrpcTimestampFromIso),
  nextPage: z.string().optional(),
});

export default listWorkflowsBasicQueryParamsSchema;
