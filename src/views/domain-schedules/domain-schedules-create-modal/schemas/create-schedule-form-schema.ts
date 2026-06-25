import { z } from 'zod';

import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import {
  SCHEDULE_CATCH_UP_POLICIES,
  SCHEDULE_OVERLAP_POLICIES,
} from '@/route-handlers/create-schedule/create-schedule.constants';
// TODO(refactor): WORKER_SDK_LANGUAGES is imported from start-workflow — extract to shared constants once both features stabilise
import { WORKER_SDK_LANGUAGES } from '@/route-handlers/start-workflow/start-workflow.constants';
import { MAX_CATCH_UP_WINDOW_DAYS } from '@/views/domain-schedules/domain-schedules-create-advanced-form/domain-schedules-create-advanced-form.constants';
import { getCronFieldsError } from '@/views/workflow-actions/workflow-action-start-form/helpers/get-cron-fields-error';

const cronExpressionFieldsSchema = z
  .object({
    minutes: z.string(),
    hours: z.string(),
    daysOfMonth: z.string(),
    months: z.string(),
    daysOfWeek: z.string(),
  })
  // If cron is invalid catch the error to proceed with better error messages in superRefine
  .catch(() => ({
    minutes: '',
    hours: '',
    daysOfMonth: '',
    months: '',
    daysOfWeek: '',
  }))
  .superRefine((data, ctx) => {
    const allFieldsHasValue = Object.values(data).every(Boolean);

    if (!allFieldsHasValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cron expression is required',
      });
      // If there are missing fields, no need to validate the cron schedule format.
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
      // multi error format exposes the general error along with field errors
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid cron schedule format',
        path: ['general'],
      });

      Object.entries(cronFieldsErrors).forEach(([errorKey, errorMessage]) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: errorMessage,
          path: [errorKey],
        });
      });
    }
  });

export const createScheduleFormSchema = z
  .object({
    // --- Main fields ---
    cronExpression: cronExpressionFieldsSchema,
    workflowType: z.object({
      name: z.string().min(1, 'Workflow type is required'),
    }),
    taskList: z.object({
      name: z.string().min(1, 'Task list is required'),
    }),
    executionStartToCloseTimeoutSeconds: z
      .number({
        required_error: 'Execution timeout is required',
      })
      .positive('Execution timeout must be positive'),
    taskStartToCloseTimeoutSeconds: z
      .number({
        required_error: 'Task timeout is required',
      })
      .positive('Task timeout must be positive'),
    // TODO(refactor): WORKER_SDK_LANGUAGES imported from start-workflow — extract to shared constants
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
            JSON.parse(val);
          } catch {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Input must be valid JSON',
              path: [i],
            });
          }
        }
      }),
    pauseOnFailure: z.boolean().optional(),

    // --- Advanced fields ---
    scheduleId: z.string().optional(),
    overlapPolicy: z.enum(SCHEDULE_OVERLAP_POLICIES).optional(),
    bufferLimit: z.string().optional(),
    concurrencyLimit: z.string().optional(),
    catchUpPolicy: z.enum(SCHEDULE_CATCH_UP_POLICIES).optional(),
    catchUpWindowDays: z
      .string()
      .refine(
        (v) =>
          v === '' || (Number(v) >= 1 && Number(v) <= MAX_CATCH_UP_WINDOW_DAYS),
        { message: 'Catch-up window must be between 1 and 90 days' }
      )
      .optional(),
    jitterSeconds: z
      .string()
      .refine((v) => v === '' || Number(v) >= 0, {
        message: 'Jitter seconds must be zero or positive',
      })
      .optional(),
    workflowIdPrefix: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // overlap policy fields
    if (
      data.overlapPolicy ===
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER &&
      data.bufferLimit !== '' &&
      data.bufferLimit !== undefined &&
      !(
        Number.isInteger(Number(data.bufferLimit)) &&
        Number(data.bufferLimit) >= 0
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Buffer limit must be a non-negative integer',
        path: ['bufferLimit'],
      });
    }

    if (
      data.overlapPolicy ===
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT &&
      data.concurrencyLimit !== '' &&
      data.concurrencyLimit !== undefined &&
      !(
        Number.isInteger(Number(data.concurrencyLimit)) &&
        Number(data.concurrencyLimit) >= 0
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Concurrency limit must be a non-negative integer',
        path: ['concurrencyLimit'],
      });
    }

    // catch up policy fields
    if (
      data.catchUpPolicy !== undefined &&
      data.catchUpPolicy !==
        ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP &&
      (data.catchUpWindowDays === '' || data.catchUpWindowDays === undefined)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Catch-up window is required',
        path: ['catchUpWindowDays'],
      });
    }
  });
