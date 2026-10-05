import { type z } from 'zod';

import { type ListSchedulesResponse as ListSchedulesResponseProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListSchedulesResponse';
import { type ScheduleListEntry as ScheduleListEntryProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleListEntry';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import type listSchedulesQueryParamsSchema from './schemas/list-schedules-query-params-schema';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type ListSchedulesRequestQueryParams = z.input<
  typeof listSchedulesQueryParamsSchema
>;

export type ScheduleListEntry = ScheduleListEntryProto;

export type ListSchedulesResponse = ListSchedulesResponseProto;

export type Context = DefaultMiddlewaresContext;
