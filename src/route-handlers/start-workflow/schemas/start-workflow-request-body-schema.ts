import { z } from 'zod';

import { WORKER_SDK_LANGUAGES } from '../start-workflow.constants';

import { jsonValueSchema } from './json-value-schema';

const startWorkflowRequestBodySchema = z.object({
  workflowType: z.object({
    name: z.string().min(1),
  }),
  taskList: z.object({
    name: z.string().min(1),
  }),
  workflowId: z.string().optional(),
  workerSDKLanguage: z.enum(WORKER_SDK_LANGUAGES),
  input: z.array(jsonValueSchema).optional(),
  executionStartToCloseTimeoutSeconds: z.number().positive(),
  taskStartToCloseTimeoutSeconds: z.number().positive().optional(),
  firstRunAt: z.string().datetime().optional(),
  cronSchedule: z.string().optional(),
  // TODO: Add workflowIdReusePolicy, retryPolicy, enableRetryPolicy, memo, searchAttributes, and header fields if needed in the future.
});

export default startWorkflowRequestBodySchema;
