import { type UseQueryOptions } from '@tanstack/react-query';

import {
  type DescribeScheduleResponse,
  type RouteParams as DescribeScheduleRouteParams,
} from '@/route-handlers/describe-schedule/describe-schedule.types';
import { type RequestError } from '@/utils/request/request-error';

export { type DescribeScheduleResponse };

export type DescribeScheduleQueryKey = [
  'describeSchedule',
  DescribeScheduleRouteParams,
];

export type UseDescribeScheduleParams = DescribeScheduleRouteParams & {
  runningScheduleRefetchIntervalMs?: number;
};

export type UseDescribeScheduleQueryOptions = UseQueryOptions<
  DescribeScheduleResponse,
  RequestError,
  DescribeScheduleResponse,
  DescribeScheduleQueryKey
>;
