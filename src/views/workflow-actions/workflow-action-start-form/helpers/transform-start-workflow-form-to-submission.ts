import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import { type Json } from '@/route-handlers/start-workflow/start-workflow.types';
import mapRetryPolicyFormToBody from '@/views/shared/retry-policy/map-retry-policy-form-to-body';

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
  };
  const retryPolicy = mapRetryPolicyFormToBody(formData);
  if (retryPolicy) {
    conditionalFormData.retryPolicy = retryPolicy;
  }

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
    ...(formData.clusterAttribute?.scope &&
      formData.clusterAttribute?.name && {
        activeClusterSelectionPolicy: {
          clusterAttribute: formData.clusterAttribute,
        },
      }),
  };
}
