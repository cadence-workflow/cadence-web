import { type UnpauseScheduleResponse as UnpauseScheduleResponseProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/UnpauseScheduleResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type UnpauseScheduleResponse = UnpauseScheduleResponseProto;

export type Context = DefaultMiddlewaresContext;
