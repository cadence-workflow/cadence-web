import { z } from 'zod';

import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import {
  SCHEDULE_CATCH_UP_POLICIES,
  SCHEDULE_OVERLAP_POLICIES,
} from '@/route-handlers/create-schedule/create-schedule.constants';
import { WORKER_SDK_LANGUAGES } from '@/route-handlers/start-workflow/start-workflow.constants';
import { getCronFieldsError } from '@/views/workflow-actions/workflow-action-start-form/helpers/get-cron-fields-error';

import {
  CATCH_UP_WINDOW_DEFAULT_DAYS,
  CATCH_UP_WINDOW_MAX_DAYS,
  CATCH_UP_WINDOW_MIN_DAYS,
} from '../create-schedule-modal.constants';

export const createScheduleFormSchema = z.object({
  cronExpression: z
    .object({
      minutes: z.string().min(1, 'Minutes is required'),
      hours: z.string().min(1, 'Hours is required'),
      daysOfMonth: z.string().min(1, 'Days of month is required'),
      months: z.string().min(1, 'Months is required'),
      daysOfWeek: z.string().min(1, 'Days of week is required'),
    })
    .superRefine((data, ctx) => {
      const allFieldsHaveValue = Object.values(data).every(Boolean);
      if (!allFieldsHaveValue) return;

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
    }),
  workflowType: z.object({
    name: z.string().min(1, 'Workflow type is required'),
  }),
  taskList: z.object({
    name: z.string().min(1, 'Task list is required'),
  }),
  executionStartToCloseTimeoutSeconds: z
    .number({ invalid_type_error: 'Execution timeout is required' })
    .positive('Execution timeout must be positive'),
  taskStartToCloseTimeoutSeconds: z
    .number({ invalid_type_error: 'Task timeout is required' })
    .positive('Task timeout must be positive'),
  workflowIdPrefix: z.string().optional(),
  workerSDKLanguage: z.enum(WORKER_SDK_LANGUAGES),
  input: z
    .array(z.string())
    .optional()
    .superRefine((inputArray, ctx) => {
      if (!inputArray) return;
      if (inputArray.length === 1 && inputArray[0] === '') return;
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
  overlapPolicy: z.enum(SCHEDULE_OVERLAP_POLICIES),
  catchUpPolicy: z.enum(SCHEDULE_CATCH_UP_POLICIES),
  catchUpWindowDays: z
    .number()
    .int()
    .min(CATCH_UP_WINDOW_MIN_DAYS)
    .max(
      CATCH_UP_WINDOW_MAX_DAYS,
      `Catch-up window cannot exceed ${CATCH_UP_WINDOW_MAX_DAYS} days`
    )
    .default(CATCH_UP_WINDOW_DEFAULT_DAYS),
  bufferLimit: z.number().int().nonnegative().default(0),
  pauseOnFailure: z.boolean().default(false),
});
