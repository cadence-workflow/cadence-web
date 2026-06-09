import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import { type CreateScheduleRequestBody } from '@/route-handlers/create-schedule/create-schedule.types';
import { type Json } from '@/route-handlers/start-workflow/start-workflow.types';

import { type CreateScheduleFormData } from '../create-schedule-form/create-schedule-form.types';

export default function transformCreateScheduleFormToBody(
  formData: CreateScheduleFormData
): CreateScheduleRequestBody {
  const cronString = CRON_FIELD_ORDER.map(
    (key) => formData.cronExpression?.[key] ?? ''
  ).join(' ');

  const parsedInput =
    formData.input?.filter((v) => v !== '').map((v) => JSON.parse(v) as Json) ??
    [];

  return {
    cronExpression: cronString,
    startWorkflow: {
      workflowType: formData.workflowType,
      taskList: formData.taskList,
      workerSDKLanguage: 'GO',
      executionStartToCloseTimeoutSeconds:
        formData.executionStartToCloseTimeoutSeconds ?? 0,
      workflowIdPrefix: '',
      taskStartToCloseTimeoutSeconds:
        formData.taskStartToCloseTimeoutSeconds ?? 0,
      ...(parsedInput.length > 0 && { input: parsedInput }),
    },
    pauseOnFailure: formData.pauseOnFailure ?? false,
  };
}
