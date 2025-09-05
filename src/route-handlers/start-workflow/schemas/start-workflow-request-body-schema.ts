import { z } from 'zod';

import { WORKER_SDK_LANGUAGES } from '../start-workflow.constants';

import jsonValueSchema from './json-value-schema';

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
  /*   workflowIdReusePolicy: z.string().optional(),
  retryPolicy: z
    .object({
      initialInterval: z.string().optional(),
      backoffCoefficient: z.number().optional(),
      maximumInterval: z.string().optional(),
      maximumAttempts: z.number().optional(),
      nonRetryableErrorReasons: z.array(z.string()).optional(),
    })
    .optional(),
  enableRetryPolicy: z.boolean().optional(),
  memo: z.record(z.string()).optional(),
  searchAttributes: z.record(z.string()).optional(),
  header: z.record(z.string()).optional(), */
});

export default startWorkflowRequestBodySchema;
