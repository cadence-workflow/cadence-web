'use client';
import { useEffect } from 'react';

import {
  type InfiniteData,
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';

import usePreviousValue from '@/hooks/use-previous-value';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { type RequestError } from '@/utils/request/request-error';

import getListWorkflowsForScheduleQueryOptions from './get-list-workflows-for-schedule-query-options';
import { type UseListWorkflowsForScheduleParams } from './use-list-workflows-for-schedule.types';

export default function useListWorkflowsForSchedule(
  params: UseListWorkflowsForScheduleParams
): UseInfiniteQueryResult<InfiniteData<ListWorkflowsResponse>, RequestError> {
  const query = useInfiniteQuery(
    getListWorkflowsForScheduleQueryOptions(params)
  );
  const { refetch } = query;
  const { runsRevision } = params;
  const previousRunsRevision = usePreviousValue(runsRevision);

  useEffect(() => {
    // The first revision describes the runs that were just loaded, so it only
    // becomes a trigger once it changes.
    if (
      runsRevision === undefined ||
      previousRunsRevision === undefined ||
      runsRevision === previousRunsRevision
    ) {
      return;
    }

    refetch({ cancelRefetch: false });
  }, [refetch, runsRevision, previousRunsRevision]);

  return query;
}
