import { type PauseScheduleResponse as PauseScheduleResponseProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/PauseScheduleResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type PauseScheduleResponse = PauseScheduleResponseProto;

export type Context = DefaultMiddlewaresContext;
