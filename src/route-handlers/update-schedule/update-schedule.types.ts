import { type z } from 'zod';

import { type UpdateScheduleResponse as UpdateScheduleResponseProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/UpdateScheduleResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import type updateScheduleRequestBodySchema from './schemas/update-schedule-request-body-schema';

export type RouteParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type UpdateScheduleResponse = UpdateScheduleResponseProto;

export type UpdateScheduleRequestBody = z.infer<
  typeof updateScheduleRequestBodySchema
>;

export type UpdateScheduleSubmissionData = UpdateScheduleRequestBody;

export type Context = DefaultMiddlewaresContext;
