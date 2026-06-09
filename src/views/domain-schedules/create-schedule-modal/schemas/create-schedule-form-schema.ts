import { z } from 'zod';

import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import { WORKER_SDK_LANGUAGES } from '@/route-handlers/start-workflow/start-workflow.constants';
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

export const createScheduleFormSchema = z.object({
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
  workflowIdPrefix: z.string().optional(),

  pauseOnFailure: z.boolean().optional().default(false),
});
