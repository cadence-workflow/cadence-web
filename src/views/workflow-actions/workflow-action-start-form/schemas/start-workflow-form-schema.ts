import { z } from 'zod';

import { WORKER_SDK_LANGUAGES } from '@/route-handlers/start-workflow/start-workflow.constants';

const baseSchema = z.object({
  workflowType: z.object({
    name: z.string().min(1, 'Workflow type name is required'),
  }),
  taskList: z.object({
    name: z.string().min(1, 'Task list name is required'),
  }),
  workerSDKLanguage: z.enum(WORKER_SDK_LANGUAGES),
  input: z
    .array(z.string())
    .optional()
    .superRefine((inputArray, ctx) => {
      if (!inputArray) return;
      if (inputArray.length === 1 && inputArray[0] === '') {
        return;
      }
      // Check each input individually for field-level errors
      for (let i = 0; i < inputArray.length; i++) {
        const val = inputArray[i];
        try {
          JSON.parse(val); // TODO: consider using losslessJsonParse
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Input must be valid JSON',
            path: [i],
          });
        }
      }
    }),
  workflowId: z.string().optional(),
  executionStartToCloseTimeoutSeconds: z.number().positive(),
  taskStartToCloseTimeoutSeconds: z.number().positive().optional(),
  // Schedule type fields
  scheduleType: z.enum(['NOW', 'LATER', 'CRON']),
  firstRunAt: z.string().optional(),
  cronSchedule: z.string().optional(),
});

export const startWorkflowFormSchema = baseSchema.superRefine((data, ctx) => {
  // Validate schedule type specific requirements
  if (data.scheduleType === 'LATER' && !data.firstRunAt) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'First run time is required when schedule type is LATER',
      path: ['firstRunAt'],
    });
  }

  if (data.scheduleType === 'CRON' && !data.cronSchedule) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cron schedule is required when schedule type is CRON',
      path: ['cronSchedule'],
    });
  }
});
