'use client';
import { useQuery } from '@tanstack/react-query';

import { type RequestError } from '@/utils/request/request-error';

import getDescribeScheduleQueryOptions from './get-describe-schedule-query-options';
import {
  type DescribeScheduleResponse,
  type DescribeScheduleQueryKey,
  type UseDescribeScheduleParams,
} from './use-describe-schedule.types';

export default function useDescribeSchedule(params: UseDescribeScheduleParams) {
  return useQuery<
    DescribeScheduleResponse,
    RequestError,
    DescribeScheduleResponse,
    DescribeScheduleQueryKey
  >(getDescribeScheduleQueryOptions(params));
}
