import isEmpty from 'lodash/isEmpty';

import { type CreateScheduleRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/CreateScheduleRequest';
import { type RetryPolicy__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/RetryPolicy';
import getGrpcTimestampFromIso from '@/utils/datetime/get-grpc-timestamp-from-iso';

import processWorkflowInput from '../../start-workflow/helpers/process-workflow-input';
import { type CreateScheduleRequestBody } from '../create-schedule.types';

import secondsToGrpcDurationInput from './seconds-to-grpc-duration-input';

export default function transformCreateScheduleBodyToGrpcInput({
  domain,
  body,
}: {
  domain: string;
  body: CreateScheduleRequestBody;
}): CreateScheduleRequest__Input {
  const retryPolicy = body.startWorkflow.retryPolicy;

  const grpcRetryPolicy: RetryPolicy__Input | undefined =
    !retryPolicy || isEmpty(retryPolicy)
      ? undefined
      : {
          initialInterval: retryPolicy.initialIntervalSeconds
            ? secondsToGrpcDurationInput(retryPolicy.initialIntervalSeconds)
            : undefined,
          backoffCoefficient: retryPolicy.backoffCoefficient,
          maximumInterval: retryPolicy.maximumIntervalSeconds
            ? secondsToGrpcDurationInput(retryPolicy.maximumIntervalSeconds)
            : undefined,
          expirationInterval: retryPolicy.expirationIntervalSeconds
            ? secondsToGrpcDurationInput(retryPolicy.expirationIntervalSeconds)
            : undefined,
          maximumAttempts: retryPolicy.maximumAttempts,
        };

  const grpcSpec = {
    cronExpression: body.cronExpression,
    startTime: body.startTime
      ? getGrpcTimestampFromIso(body.startTime)
      : undefined,
    endTime: body.endTime ? getGrpcTimestampFromIso(body.endTime) : undefined,
    jitter: body.jitterSeconds
      ? secondsToGrpcDurationInput(body.jitterSeconds)
      : undefined,
  };

  const startWorkflow = body.startWorkflow;
  const processedInput = processWorkflowInput({
    input: startWorkflow.input,
    workerSDKLanguage: startWorkflow.workerSDKLanguage,
  });

  const grpcStartWorkflow = {
    workflowType: startWorkflow.workflowType,
    taskList: startWorkflow.taskList,
    input: processedInput
      ? { data: Buffer.from(processedInput, 'utf-8') }
      : undefined,
    workflowIdPrefix: startWorkflow.workflowIdPrefix?.trim() ?? '',
    executionStartToCloseTimeout: secondsToGrpcDurationInput(
      startWorkflow.executionStartToCloseTimeoutSeconds
    ),
    taskStartToCloseTimeout: secondsToGrpcDurationInput(
      startWorkflow.taskStartToCloseTimeoutSeconds
    ),
    retryPolicy: grpcRetryPolicy,
    memo: startWorkflow.memo
      ? {
          fields: Object.fromEntries(
            Object.entries(startWorkflow.memo).map(([k, v]) => [
              k,
              { data: Buffer.from(JSON.stringify(v), 'utf-8') },
            ])
          ),
        }
      : undefined,
    searchAttributes: startWorkflow.searchAttributes
      ? {
          indexedFields: Object.fromEntries(
            Object.entries(startWorkflow.searchAttributes).map(([k, v]) => [
              k,
              { data: Buffer.from(JSON.stringify(v), 'utf-8') },
            ])
          ),
        }
      : undefined,
  };

  return {
    domain,
    scheduleId: body.scheduleId,

    spec: grpcSpec,

    action: { startWorkflow: grpcStartWorkflow },

    policies: {
      overlapPolicy: body.overlapPolicy,
      catchUpPolicy: body.catchUpPolicy,
      catchUpWindow:
        body.catchUpWindowSeconds !== undefined
          ? secondsToGrpcDurationInput(body.catchUpWindowSeconds)
          : undefined,
      pauseOnFailure: body.pauseOnFailure,
      bufferLimit: body.bufferLimit,
      concurrencyLimit: body.concurrencyLimit,
    },
  };
}
