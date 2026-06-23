import pickBy from 'lodash/pickBy';

import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import { type CreateScheduleRequestBody } from '@/route-handlers/create-schedule/create-schedule.types';
import { type Json } from '@/route-handlers/start-workflow/start-workflow.types';

import { type DomainSchedulesCreateFormData } from '../domain-schedules-create-modal.types';

export default function transformDomainSchedulesCreateFormToBody(
  formData: DomainSchedulesCreateFormData
): CreateScheduleRequestBody {
  const cronString = CRON_FIELD_ORDER.map(
    (key) => formData.cronExpression?.[key] ?? ''
  ).join(' ');

  const parsedInput = formData.input
    ?.filter((v) => v.trim() !== '')
    .map((v) => JSON.parse(v) as Json);
  const mappedRetryPolicy =
    formData.enableRetryPolicy && formData.retryPolicy
      ? {
          initialIntervalSeconds: formData.retryPolicy.initialIntervalSeconds,
          backoffCoefficient: formData.retryPolicy.backoffCoefficient,
          ...(formData.retryPolicy.maximumIntervalSeconds !== undefined
            ? {
                maximumIntervalSeconds:
                  formData.retryPolicy.maximumIntervalSeconds,
              }
            : {}),
          ...(formData.limitRetries === 'ATTEMPTS'
            ? { maximumAttempts: formData.retryPolicy.maximumAttempts }
            : {
                expirationIntervalSeconds:
                  formData.retryPolicy.expirationIntervalSeconds,
              }),
        }
      : undefined;

  return {
    cronExpression: cronString,
    startWorkflow: {
      workflowType: { name: formData.workflowType.name.trim() },
      taskList: { name: formData.taskList.name.trim() },
      workerSDKLanguage: formData.workerSDKLanguage,
      executionStartToCloseTimeoutSeconds:
        formData.executionStartToCloseTimeoutSeconds,
      taskStartToCloseTimeoutSeconds: formData.taskStartToCloseTimeoutSeconds,
      ...(parsedInput && parsedInput.length > 0 ? { input: parsedInput } : {}),
      ...(mappedRetryPolicy ? { retryPolicy: mappedRetryPolicy } : {}),
      ...(formData.workflowIdPrefix?.trim()
        ? { workflowIdPrefix: formData.workflowIdPrefix.trim() }
        : {}),
    },

    // fields that are only present if they are defined
    ...pickBy(
      {
        pauseOnFailure: formData.pauseOnFailure ?? undefined,
        overlapPolicy: formData.overlapPolicy ?? undefined,
        catchUpPolicy: formData.catchUpPolicy ?? undefined,
        bufferLimit:
          formData.overlapPolicy ===
            ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER &&
          formData.bufferLimit
            ? parseInt(formData.bufferLimit, 10)
            : undefined,
        concurrencyLimit:
          formData.overlapPolicy ===
            ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT &&
          formData.concurrencyLimit
            ? parseInt(formData.concurrencyLimit, 10)
            : undefined,
        catchUpWindowSeconds:
          formData.catchUpPolicy !== undefined &&
          formData.catchUpPolicy !==
            ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP &&
          formData.catchUpWindowDays
            ? parseInt(formData.catchUpWindowDays, 10) * 24 * 60 * 60
            : undefined,
        scheduleId: formData.scheduleId?.trim() || undefined,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        jitterSeconds: formData.jitterSeconds
          ? parseFloat(formData.jitterSeconds)
          : undefined,
      },
      (value) => value !== undefined
    ),
  };
}
