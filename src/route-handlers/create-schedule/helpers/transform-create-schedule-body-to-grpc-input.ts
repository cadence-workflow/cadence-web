import isEmpty from 'lodash/isEmpty';

import { type CreateScheduleRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/CreateScheduleRequest';
import { type RetryPolicy__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/RetryPolicy';

import processWorkflowInput from '../../start-workflow/helpers/process-workflow-input';
import { DEFAULT_TASK_START_TO_CLOSE_TIMEOUT_SECONDS } from '../../start-workflow/start-workflow.constants';
import { type CreateScheduleRequestBody } from '../create-schedule.types';

function isoToTimestamp(iso: string): { seconds: number; nanos: number } {
  const ms = Date.parse(iso);
  const seconds = Math.floor(ms / 1000);
  const nanos = (ms % 1000) * 1_000_000;
  return { seconds, nanos };
}

function secondsToDuration(seconds: number): {
  seconds: number;
  nanos: number;
} {
  return { seconds, nanos: 0 };
}

function mapRetryPolicy(
  retryPolicy: CreateScheduleRequestBody['action']['startWorkflow']['retryPolicy']
): RetryPolicy__Input | undefined {
  if (!retryPolicy || isEmpty(retryPolicy)) {
    return undefined;
  }

  return {
    initialInterval: retryPolicy.initialIntervalSeconds
      ? secondsToDuration(retryPolicy.initialIntervalSeconds)
      : undefined,
    backoffCoefficient: retryPolicy.backoffCoefficient,
    maximumInterval: retryPolicy.maximumIntervalSeconds
      ? secondsToDuration(retryPolicy.maximumIntervalSeconds)
      : undefined,
    expirationInterval: retryPolicy.expirationIntervalSeconds
      ? secondsToDuration(retryPolicy.expirationIntervalSeconds)
      : undefined,
    maximumAttempts: retryPolicy.maximumAttempts,
  };
}

export default function transformCreateScheduleBodyToGrpcInput({
  domain,
  body,
}: {
  domain: string;
  body: CreateScheduleRequestBody;
}): CreateScheduleRequest__Input {
  const { scheduleId, spec, action, policies, memo, searchAttributes } = body;
  const sw = action.startWorkflow;
  const processedInput = processWorkflowInput({
    input: sw.input,
    workerSDKLanguage: sw.workerSDKLanguage,
  });

  return {
    domain,
    scheduleId,
    spec: {
      cronExpression: spec.cronExpression,
      startTime: spec.startTime ? isoToTimestamp(spec.startTime) : undefined,
      endTime: spec.endTime ? isoToTimestamp(spec.endTime) : undefined,
      jitter: spec.jitterSeconds
        ? secondsToDuration(spec.jitterSeconds)
        : undefined,
    },
    action: {
      startWorkflow: {
        workflowType: sw.workflowType,
        taskList: sw.taskList,
        input: processedInput
          ? { data: Buffer.from(processedInput, 'utf-8') }
          : undefined,
        workflowIdPrefix: sw.workflowIdPrefix,
        executionStartToCloseTimeout: secondsToDuration(
          sw.executionStartToCloseTimeoutSeconds
        ),
        taskStartToCloseTimeout: secondsToDuration(
          sw.taskStartToCloseTimeoutSeconds ??
            DEFAULT_TASK_START_TO_CLOSE_TIMEOUT_SECONDS
        ),
        retryPolicy: mapRetryPolicy(sw.retryPolicy),
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
    policies: policies
      ? {
          overlapPolicy: policies.overlapPolicy,
          catchUpPolicy: policies.catchUpPolicy,
          catchUpWindow:
            policies.catchUpWindowSeconds !== undefined
              ? secondsToDuration(policies.catchUpWindowSeconds)
              : undefined,
          pauseOnFailure: policies.pauseOnFailure,
          bufferLimit: policies.bufferLimit,
          concurrencyLimit: policies.concurrencyLimit,
        }
      : undefined,
    memo: memo
      ? {
          fields: Object.fromEntries(
            Object.entries(memo).map(([k, v]) => [
              k,
              { data: Buffer.from(JSON.stringify(v), 'utf-8') },
            ])
          ),
        }
      : undefined,
    searchAttributes: searchAttributes
      ? {
          indexedFields: Object.fromEntries(
            Object.entries(searchAttributes).map(([k, v]) => [
              k,
              { data: Buffer.from(JSON.stringify(v), 'utf-8') },
            ])
          ),
        }
      : undefined,
  };
}
