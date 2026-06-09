import { type UseMutationResult } from '@tanstack/react-query';

import {
  type CreateScheduleRequestBody,
  type CreateScheduleResponseBody,
} from '@/route-handlers/create-schedule/create-schedule.types';
import { type RequestError } from '@/utils/request/request-error';

export type UseCreateScheduleParams = {
  domain: string;
  cluster: string;
};

export type UseCreateScheduleVariables = CreateScheduleRequestBody;

export type UseCreateScheduleResult = UseMutationResult<
  CreateScheduleResponseBody,
  RequestError,
  UseCreateScheduleVariables
>;
