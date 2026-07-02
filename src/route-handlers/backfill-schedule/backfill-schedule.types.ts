import { type z } from 'zod';

import { type BackfillScheduleResponse as BackfillScheduleResponseProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/BackfillScheduleResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import { type backfillScheduleRequestBodySchema } from './schemas/backfill-schedule-request-body-schema';

export type RouteParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type BackfillScheduleResponse = BackfillScheduleResponseProto;

export type BackfillScheduleRequestBody = z.infer<
  typeof backfillScheduleRequestBodySchema
>;

/** POST body shape shared by the backfill form UI. */
export type BackfillScheduleSubmissionData = BackfillScheduleRequestBody;

export type Context = DefaultMiddlewaresContext;
