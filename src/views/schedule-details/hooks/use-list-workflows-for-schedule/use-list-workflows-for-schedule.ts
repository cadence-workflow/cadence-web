'use client';
import { useEffect, useRef } from 'react';

import {
  type InfiniteData,
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';

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
  // The first revision describes the runs that were just loaded, so it only
  // becomes a trigger once it changes.
  const handledRunsRevisionRef = useRef(runsRevision);

  useEffect(() => {
    if (
      runsRevision === undefined ||
      runsRevision === handledRunsRevisionRef.current
    ) {
      return;
    }

    const isFirstRevision = handledRunsRevisionRef.current === undefined;
    handledRunsRevisionRef.current = runsRevision;

    if (isFirstRevision) {
      return;
    }

    // Never cancel a page the caller is already waiting on; a revision that
    // lands mid-fetch is picked up by the periodic refresh instead.
    void refetch({ cancelRefetch: false });
  }, [refetch, runsRevision]);

  return query;
}
