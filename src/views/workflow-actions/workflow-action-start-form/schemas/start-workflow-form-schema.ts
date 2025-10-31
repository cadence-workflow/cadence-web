import { z } from 'zod';

import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import {
  WORKER_SDK_LANGUAGES,
  WORKFLOW_ID_REUSE_POLICIES,
} from '@/route-handlers/start-workflow/start-workflow.constants';

import { getCronFieldsError } from '../helpers/get-cron-fields-error';

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
  workflowIdReusePolicy: z.enum(WORKFLOW_ID_REUSE_POLICIES).optional(),
  memo: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }, 'Memo must be valid JSON Object'),
  searchAttributes: z
    .array(
      z.object({
        key: z.string().min(1, 'Attribute key is required'),
        value: z.union([
          z.string().min(1, 'Attribute value is required'),
          z.number(),
          z.boolean(),
        ]),
      })
    )
    .optional(),

  header: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      try {
        const parsed = JSON.parse(val);

        return Object.entries(parsed).every(
          (entry) => typeof entry[1] === 'string'
        );
      } catch {
        return false;
      }
    }, 'Headers must be valid JSON Object, keys and values must be strings'),
  // Schedule type fields
  scheduleType: z.enum(['NOW', 'LATER', 'CRON']),
  firstRunAt: z.string().optional(),
  cronSchedule: z
    .object({
      minutes: z.string().min(1, 'Minutes is required'),
      hours: z.string().min(1, 'Hours is required'),
      daysOfMonth: z.string().min(1, 'Days of month is required'),
      months: z.string().min(1, 'Months is required'),
      daysOfWeek: z.string().min(1, 'Days of week is required'),
    })
    .superRefine((data, ctx) => {
      const allFieldsHasValue = Object.values(data).every((value) =>
        Boolean(value)
      );

      // If there are missing fields, no need to validate the cron schedule format.
      if (!allFieldsHasValue) {
        return;
      }

      const cronString = CRON_FIELD_ORDER.map((key) => data[key]).join(' ');
      const cronFieldsErrors = getCronFieldsError(cronString);

      if (!cronFieldsErrors) return;

      if (cronFieldsErrors?.general) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid cron schedule format',
        });
      } else {
        Object.entries(cronFieldsErrors).forEach(([errorKey, errorMessage]) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: errorMessage,
            path: [errorKey],
          });
        });
      }
    })
    .optional(),
  // Retry policy fields
  enableRetryPolicy: z.boolean().optional(),
  limitRetries: z.enum(['ATTEMPTS', 'DURATION']).optional(),
  retryPolicy: z
    .object({
      initialIntervalSeconds: z.string().optional(),
      backoffCoefficient: z.string().optional(),
      maximumIntervalSeconds: z.string().optional(),
      maximumAttempts: z.string().optional(),
      expirationIntervalSeconds: z.string().optional(),
    })
    .optional(),
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

  // Validate retry policy configuration when enabled
  if (data.enableRetryPolicy) {
    // Check required fields for retry policy
    if (!data.retryPolicy?.initialIntervalSeconds) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Initial interval is required when retry policy is enabled',
        path: ['retryPolicy', 'initialIntervalSeconds'],
      });
    }

    if (!data.retryPolicy?.backoffCoefficient) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Backoff coefficient is required when retry policy is enabled',
        path: ['retryPolicy', 'backoffCoefficient'],
      });
    }

    // Validate retry limit specific requirements
    if (
      data.limitRetries === 'ATTEMPTS' &&
      !data.retryPolicy?.maximumAttempts
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Maximum attempts is required when retries limit is ATTEMPTS',
        path: ['retryPolicy', 'maximumAttempts'],
      });
    }

    if (
      data.limitRetries === 'DURATION' &&
      !data.retryPolicy?.expirationIntervalSeconds
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Expiration interval is required when retries limit is DURATION',
        path: ['retryPolicy', 'expirationIntervalSeconds'],
      });
    }
  }
});
