import { type CreateScheduleRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/CreateScheduleRequest';
import getGrpcTimestampFromIso from '@/utils/datetime/get-grpc-timestamp-from-iso';

import processWorkflowInput from '../../start-workflow/helpers/process-workflow-input';
import { DEFAULT_TASK_START_TO_CLOSE_TIMEOUT_SECONDS } from '../../start-workflow/start-workflow.constants';
import { type CreateScheduleRequestBody } from '../create-schedule.types';

import mapRetryPolicyToGrpcInput from './map-retry-policy-to-grpc-input';
import secondsToGrpcDurationInput from './seconds-to-grpc-duration-input';

export default function transformCreateScheduleBodyToGrpcInput({
  domain,
  body,
}: {
  domain: string;
  body: CreateScheduleRequestBody;
}): CreateScheduleRequest__Input {
  const {
    // Schedule identity
    scheduleId,

    // Schedule spec
    cronExpression,
    startTime,
    endTime,
    jitterSeconds,

    // Schedule policies
    overlapPolicy,
    catchUpPolicy,
    catchUpWindowSeconds,
    pauseOnFailure,
    bufferLimit,
    concurrencyLimit,

    // Start-workflow action
    startWorkflow: sw,
  } = body;

  const processedInput = processWorkflowInput({
    input: sw.input,
    workerSDKLanguage: sw.workerSDKLanguage,
  });

  return {
    domain,
    scheduleId,

    // Schedule spec
    spec: {
      cronExpression,
      startTime: startTime ? getGrpcTimestampFromIso(startTime) : undefined,
      endTime: endTime ? getGrpcTimestampFromIso(endTime) : undefined,
      jitter: jitterSeconds
        ? secondsToGrpcDurationInput(jitterSeconds)
        : undefined,
    },

    // Start-workflow action
    action: {
      startWorkflow: {
        workflowType: sw.workflowType,
        taskList: sw.taskList,
        input: processedInput
          ? { data: Buffer.from(processedInput, 'utf-8') }
          : undefined,
        workflowIdPrefix: sw.workflowIdPrefix,
        executionStartToCloseTimeout: secondsToGrpcDurationInput(
          sw.executionStartToCloseTimeoutSeconds
        ),
        taskStartToCloseTimeout: secondsToGrpcDurationInput(
          sw.taskStartToCloseTimeoutSeconds ??
            DEFAULT_TASK_START_TO_CLOSE_TIMEOUT_SECONDS
        ),
        retryPolicy: mapRetryPolicyToGrpcInput(sw.retryPolicy),
        memo: sw.memo
          ? {
              fields: Object.fromEntries(
                Object.entries(sw.memo).map(([k, v]) => [
                  k,
                  { data: Buffer.from(JSON.stringify(v), 'utf-8') },
                ])
              ),
            }
          : undefined,
        searchAttributes: sw.searchAttributes
          ? {
              indexedFields: Object.fromEntries(
                Object.entries(sw.searchAttributes).map(([k, v]) => [
                  k,
                  { data: Buffer.from(JSON.stringify(v), 'utf-8') },
                ])
              ),
            }
          : undefined,
      },
    },

    // Schedule policies
    policies: {
      overlapPolicy,
      catchUpPolicy,
      catchUpWindow:
        catchUpWindowSeconds !== undefined
          ? secondsToGrpcDurationInput(catchUpWindowSeconds)
          : undefined,
      pauseOnFailure,
      bufferLimit,
      concurrencyLimit,
    },
  };
}
