import { z } from 'zod';

import getGrpcTimestampFromIso from '@/utils/datetime/get-grpc-timestamp-from-iso';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

const listWorkflowsBasicQueryParamsSchema = z
  .object({
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
  })
  .refine((params) => {
    let definedFiltersCount = 0;
    // Execution filter
    if (params.workflowId || params.runId) {
      definedFiltersCount += 1;
    }
    // Type filter
    if (params.workflowType) {
      definedFiltersCount += 1;
    }
    // Status filter
    if (params.closeStatus) {
      definedFiltersCount += 1;
    }

    return definedFiltersCount <= 1;
    // TODO @adhitya.mamallan - If we add RunID back, add it in the message below
  }, 'Only one of the following filters is allowed - Workflow ID, Workflow Type, Close Status');

export default listWorkflowsBasicQueryParamsSchema;
