import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import { type CreateScheduleRequestBody } from '@/route-handlers/create-schedule/create-schedule.types';

import { type CreateScheduleFormData } from '../create-schedule-form/create-schedule-form.types';

function newScheduleId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function transformCreateScheduleFormToBody(
  formData: CreateScheduleFormData
): CreateScheduleRequestBody {
  const scheduleId = newScheduleId();
  const cronString = CRON_FIELD_ORDER.map(
    (key) => formData.cronExpression?.[key] ?? ''
  ).join(' ');

  return {
    scheduleId,
    cronExpression: cronString,
    startWorkflow: {
      workflowType: formData.workflowType,
      taskList: formData.taskList,
      workerSDKLanguage: formData.workerSDKLanguage,
      executionStartToCloseTimeoutSeconds:
        formData.executionStartToCloseTimeoutSeconds,
      workflowIdPrefix: '',
      taskStartToCloseTimeoutSeconds: formData.taskStartToCloseTimeoutSeconds,
    },
    pauseOnFailure: formData.pauseOnFailure ?? false,
  };
}
