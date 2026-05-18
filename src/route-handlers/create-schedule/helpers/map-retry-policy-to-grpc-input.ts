import isEmpty from 'lodash/isEmpty';

import { type RetryPolicy__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/RetryPolicy';

import { type CreateScheduleRequestBody } from '../create-schedule.types';

import secondsToGrpcDurationInput from './seconds-to-grpc-duration-input';

export default function mapRetryPolicyToGrpcInput(
  retryPolicy: CreateScheduleRequestBody['startWorkflow']['retryPolicy']
): RetryPolicy__Input | undefined {
  if (!retryPolicy || isEmpty(retryPolicy)) {
    return undefined;
  }

  return {
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
}
