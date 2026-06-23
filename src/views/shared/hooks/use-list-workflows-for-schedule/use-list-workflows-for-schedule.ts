'use client';
import { useInfiniteQuery } from '@tanstack/react-query';

import getListWorkflowsForScheduleQueryOptions from './get-list-workflows-for-schedule-query-options';
import { type UseListWorkflowsForScheduleParams } from './use-list-workflows-for-schedule.types';

export default function useListWorkflowsForSchedule(
  params: UseListWorkflowsForScheduleParams
) {
  return useInfiniteQuery(getListWorkflowsForScheduleQueryOptions(params));
}
