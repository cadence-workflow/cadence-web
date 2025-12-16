import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import { type Json } from '@/route-handlers/start-workflow/start-workflow.types';

import {
  type StartWorkflowFormData,
  type StartWorkflowSubmissionData,
} from '../workflow-action-start-form.types';

export default function transformStartWorkflowFormToSubmission(
  formData: StartWorkflowFormData
): StartWorkflowSubmissionData {
  const basicFormData = {
    taskList: formData.taskList,
    workflowType: formData.workflowType,
    workerSDKLanguage: formData.workerSDKLanguage,
    executionStartToCloseTimeoutSeconds:
      formData.executionStartToCloseTimeoutSeconds,
    workflowId: formData.workflowId,
    workflowIdReusePolicy: formData.workflowIdReusePolicy,
  };
  const conditionalFormData: Partial<StartWorkflowSubmissionData> = {
    ...(formData.scheduleType === 'LATER' && {
      firstRunAt: formData.firstRunAt,
    }),
    ...(formData.scheduleType === 'CRON' && {
      cronSchedule: CRON_FIELD_ORDER.map(
        (key) => formData.cronSchedule?.[key]
      ).join(' '),
    }),
    ...(formData.enableRetryPolicy && {
      retryPolicy: {
        initialIntervalSeconds: formData.retryPolicy?.initialIntervalSeconds
          ? parseInt(formData.retryPolicy?.initialIntervalSeconds, 10)
          : undefined,
        backoffCoefficient: formData.retryPolicy?.backoffCoefficient
          ? parseFloat(formData.retryPolicy?.backoffCoefficient)
          : undefined,
        maximumIntervalSeconds: formData.retryPolicy?.maximumIntervalSeconds
          ? parseInt(formData.retryPolicy?.maximumIntervalSeconds, 10)
          : undefined,
        ...(formData.limitRetries === 'ATTEMPTS' && {
          maximumAttempts: formData.retryPolicy?.maximumAttempts
            ? parseInt(formData.retryPolicy?.maximumAttempts, 10)
            : undefined,
        }),
        ...(formData.limitRetries === 'DURATION' && {
          expirationIntervalSeconds: formData.retryPolicy
            ?.expirationIntervalSeconds
            ? parseInt(formData.retryPolicy?.expirationIntervalSeconds, 10)
            : undefined,
        }),
      },
    }),
  };

  const searchAttributesObject =
    formData?.searchAttributes && formData.searchAttributes.length > 0
      ? Object.fromEntries(
          formData.searchAttributes.map((item) => [item.key, item.value])
        )
      : undefined;

  return {
    ...basicFormData,
    ...conditionalFormData,
    input: formData?.input
      ?.filter((v) => v !== '')
      .map((v) => JSON.parse(v) as Json),
    memo: formData?.memo ? JSON.parse(formData?.memo) : undefined,
    searchAttributes: searchAttributesObject,
    header: formData?.header ? JSON.parse(formData?.header) : undefined,
  };
}
