import { type z } from 'zod';

import { type CreateScheduleResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/CreateScheduleResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import type createScheduleRequestBodySchema from './schemas/create-schedule-request-body-schema';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type CreateScheduleRequestBody = z.infer<
  typeof createScheduleRequestBodySchema
>;

export type CreateScheduleResponseBody = CreateScheduleResponse;

export type Context = DefaultMiddlewaresContext;
