import { type DescribeScheduleResponse as DescribeScheduleResponseProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeScheduleResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type DescribeScheduleResponse = DescribeScheduleResponseProto;

export type Context = DefaultMiddlewaresContext;
