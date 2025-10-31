import { z } from 'zod';

import {
  WORKER_SDK_LANGUAGES,
  WORKFLOW_ID_REUSE_POLICIES,
} from '../start-workflow.constants';

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

  workflowIdReusePolicy: z.enum(WORKFLOW_ID_REUSE_POLICIES).optional(),
  retryPolicy: z
    .object({
      initialIntervalSeconds: z.number().optional(),
      backoffCoefficient: z.number().optional(),
      maximumIntervalSeconds: z.number().optional(),
      expirationIntervalSeconds: z.number().optional(),
      maximumAttempts: z.number().optional(),
    })
    .optional(),
  memo: z.record(z.any()).optional(),
  searchAttributes: z
    .record(z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
  header: z.record(z.string()).optional(),
});

export default startWorkflowRequestBodySchema;
