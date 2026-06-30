import { type DeleteScheduleResponse as DeleteScheduleResponseProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/DeleteScheduleResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type DeleteScheduleResponse = DeleteScheduleResponseProto;

export type Context = DefaultMiddlewaresContext;
