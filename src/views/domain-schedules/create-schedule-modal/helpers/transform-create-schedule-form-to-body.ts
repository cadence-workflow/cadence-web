import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import { type CreateScheduleRequestBody } from '@/route-handlers/create-schedule/create-schedule.types';

import { type CreateScheduleFormData } from '../create-schedule-form/create-schedule-form.types';

export default function transformCreateScheduleFormToBody(
  formData: CreateScheduleFormData
): CreateScheduleRequestBody {
  const cronString = CRON_FIELD_ORDER.map(
    (key) => formData.cronExpression?.[key] ?? ''
  ).join(' ');

  return {
    cronExpression: cronString,
    startWorkflow: {
      workflowType: formData.workflowType,
      taskList: formData.taskList,
      workerSDKLanguage: formData.workerSDKLanguage ?? 'GO',
      executionStartToCloseTimeoutSeconds:
        formData.executionStartToCloseTimeoutSeconds ?? 0,
      workflowIdPrefix: formData.workflowIdPrefix ?? '',
      taskStartToCloseTimeoutSeconds:
        formData.taskStartToCloseTimeoutSeconds ?? 0,
    },
    pauseOnFailure: formData.pauseOnFailure ?? false,
  };
}
