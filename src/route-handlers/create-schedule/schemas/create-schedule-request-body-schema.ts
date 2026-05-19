import { z } from 'zod';

import { jsonValueSchema } from '../../start-workflow/schemas/json-value-schema';
import {
  SCHEDULE_CATCH_UP_POLICIES,
  SCHEDULE_OVERLAP_POLICIES,
  WORKER_SDK_LANGUAGES,
} from '../create-schedule.constants';

const retryPolicySchema = z
  .object({
    initialIntervalSeconds: z.number().optional(),
    backoffCoefficient: z.number().optional(),
    maximumIntervalSeconds: z.number().optional(),
    expirationIntervalSeconds: z.number().optional(),
    maximumAttempts: z.number().optional(),
  })
  .optional();

const scheduleStartWorkflowBodySchema = z.object({
  workflowType: z.object({
    name: z.string().min(1),
  }),
  taskList: z.object({
    name: z.string().min(1),
  }),
  workerSDKLanguage: z.enum(WORKER_SDK_LANGUAGES),
  input: z.array(jsonValueSchema).optional(),
  workflowIdPrefix: z.string(),
  executionStartToCloseTimeoutSeconds: z.number().positive(),
  taskStartToCloseTimeoutSeconds: z.number().positive(),
  retryPolicy: retryPolicySchema,
  memo: z.record(z.any()).optional(),
  searchAttributes: z
    .record(z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
});

const createScheduleRequestBodySchema = z.object({
  // Schedule identity (server generates one when omitted)
  scheduleId: z.string().min(1).optional(),

  // Schedule spec
  cronExpression: z.string().min(1),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  jitterSeconds: z.number().nonnegative().optional(),

  // Schedule policies
  overlapPolicy: z.enum(SCHEDULE_OVERLAP_POLICIES).optional(),
  catchUpPolicy: z.enum(SCHEDULE_CATCH_UP_POLICIES).optional(),
  catchUpWindowSeconds: z.number().nonnegative().optional(),
  pauseOnFailure: z.boolean().optional(),
  bufferLimit: z.number().int().nonnegative().optional(),
  concurrencyLimit: z.number().int().nonnegative().optional(),

  // Start-workflow action
  startWorkflow: scheduleStartWorkflowBodySchema,
});

export default createScheduleRequestBodySchema;
