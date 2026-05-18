import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import { type CreateScheduleRequestBody } from '@/route-handlers/create-schedule/create-schedule.types';
import { type Json } from '@/route-handlers/start-workflow/start-workflow.types';

import { SECONDS_PER_DAY } from '../create-schedule-modal.constants';
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

  const parsedInput =
    formData.input
      ?.filter((v) => v !== '')
      .map((v) => JSON.parse(v) as Json) ?? [];

  const trimmedPrefix = formData.workflowIdPrefix?.trim() ?? '';

  return {
    scheduleId,
    spec: {
      cronExpression: cronString,
    },
    action: {
      startWorkflow: {
        workflowType: formData.workflowType,
        taskList: formData.taskList,
        workerSDKLanguage: formData.workerSDKLanguage,
        executionStartToCloseTimeoutSeconds:
          formData.executionStartToCloseTimeoutSeconds ?? 0,
        workflowIdPrefix: trimmedPrefix || scheduleId,
        taskStartToCloseTimeoutSeconds: formData.taskStartToCloseTimeoutSeconds,
        ...(parsedInput.length > 0 && { input: parsedInput }),
      },
    },
    policies: {
      overlapPolicy: formData.overlapPolicy,
      catchUpPolicy: formData.catchUpPolicy,
      ...(formData.catchUpPolicy !== 'SCHEDULE_CATCH_UP_POLICY_SKIP' && {
        catchUpWindowSeconds:
          (formData.catchUpWindowDays ?? 0) * SECONDS_PER_DAY,
      }),
      bufferLimit: formData.bufferLimit ?? 0,
      pauseOnFailure: formData.pauseOnFailure ?? false,
    },
  };
}
