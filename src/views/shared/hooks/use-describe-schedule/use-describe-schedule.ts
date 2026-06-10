'use client';
import { useQuery } from '@tanstack/react-query';

import getDescribeScheduleQueryOptions from './get-describe-schedule-query-options';
import { type UseDescribeScheduleParams } from './use-describe-schedule.types';

export default function useDescribeSchedule(
  params: UseDescribeScheduleParams
) {
  return useQuery(getDescribeScheduleQueryOptions(params));
}
