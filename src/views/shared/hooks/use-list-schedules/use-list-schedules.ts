'use client';
import { useInfiniteQuery } from '@tanstack/react-query';

import getListSchedulesQueryOptions from './get-list-schedules-query-options';
import { type UseListSchedulesParams } from './use-list-schedules.types';

export default function useListSchedules(params: UseListSchedulesParams) {
  return useInfiniteQuery(getListSchedulesQueryOptions(params));
}
