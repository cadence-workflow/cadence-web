'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  type InfiniteData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';

import combineHistoricalData from './combine-historical-data';
import {
  getHistoricalWorkflowsForScheduleQueryOptions,
  getLatestWorkflowsForScheduleQueryOptions,
} from './get-list-workflows-for-schedule-query-options';
import pagesOverlap from './pages-overlap';
import { type UseListWorkflowsForScheduleParams } from './use-list-workflows-for-schedule.types';

export default function useListWorkflowsForSchedule(
  params: UseListWorkflowsForScheduleParams
) {
  const queryParams = {
    domain: params.domain,
    cluster: params.cluster,
    scheduleId: params.scheduleId,
    pageSize: params.pageSize,
  };
  const latestQuery = useQuery(
    getLatestWorkflowsForScheduleQueryOptions(params)
  );
  const initialHistoricalPageParam = latestQuery.data?.nextPage || undefined;
  const previousInitialPageParamRef = useRef(initialHistoricalPageParam);
  const previousCombinedHistoricalDataRef =
    useRef<InfiniteData<ListWorkflowsResponse>>();
  const [retainedHistoricalData, setRetainedHistoricalData] =
    useState<InfiniteData<ListWorkflowsResponse>>();
  const didHistoricalPageParamChange =
    previousInitialPageParamRef.current !== initialHistoricalPageParam;
  const historicalDataBeforeRefresh = previousCombinedHistoricalDataRef.current;
  const activeRetainedHistoricalData = didHistoricalPageParamChange
    ? historicalDataBeforeRefresh
    : retainedHistoricalData;

  const historicalQuery = useInfiniteQuery(
    getHistoricalWorkflowsForScheduleQueryOptions({
      initialPageParam: initialHistoricalPageParam,
      params: queryParams,
    })
  );
  const {
    data: historicalData,
    error: historicalError,
    fetchNextPage,
    hasNextPage,
    isFetching: isFetchingHistorical,
    isFetchingNextPage,
  } = historicalQuery;
  const historicalDataOverlapsRetainedData = pagesOverlap(
    historicalData,
    activeRetainedHistoricalData
  );

  useEffect(() => {
    if (!didHistoricalPageParamChange) {
      return;
    }

    setRetainedHistoricalData(historicalDataBeforeRefresh);
    previousInitialPageParamRef.current = initialHistoricalPageParam;
  }, [
    didHistoricalPageParamChange,
    historicalDataBeforeRefresh,
    initialHistoricalPageParam,
  ]);

  const combinedHistoricalData = useMemo(() => {
    if (!historicalData) {
      return activeRetainedHistoricalData;
    }

    if (!activeRetainedHistoricalData) {
      return historicalData;
    }

    return combineHistoricalData(historicalData, activeRetainedHistoricalData);
  }, [activeRetainedHistoricalData, historicalData]);

  // Snapshot the last combined result so a re-key can fall back to it while the
  // infinite query refetches. Skipped mid-refresh so the snapshot is not
  // clobbered by the partial data it is meant to cover for.
  useEffect(() => {
    if (didHistoricalPageParamChange) {
      return;
    }

    previousCombinedHistoricalDataRef.current = combinedHistoricalData;
  }, [combinedHistoricalData, didHistoricalPageParamChange]);

  useEffect(() => {
    if (
      !activeRetainedHistoricalData ||
      !initialHistoricalPageParam ||
      historicalDataOverlapsRetainedData ||
      isFetchingHistorical ||
      (!hasNextPage && historicalData)
    ) {
      return;
    }

    void fetchNextPage();
  }, [
    activeRetainedHistoricalData,
    fetchNextPage,
    hasNextPage,
    historicalData,
    historicalDataOverlapsRetainedData,
    initialHistoricalPageParam,
    isFetchingHistorical,
  ]);

  useEffect(() => {
    if (!activeRetainedHistoricalData) {
      return;
    }

    if (
      !initialHistoricalPageParam ||
      (historicalData && !hasNextPage && !historicalDataOverlapsRetainedData)
    ) {
      setRetainedHistoricalData(undefined);
    }
  }, [
    activeRetainedHistoricalData,
    hasNextPage,
    historicalData,
    historicalDataOverlapsRetainedData,
    initialHistoricalPageParam,
  ]);

  const data = useMemo(
    () =>
      latestQuery.data
        ? {
            pages: [latestQuery.data, ...(combinedHistoricalData?.pages ?? [])],
            pageParams: [
              undefined,
              ...(combinedHistoricalData?.pageParams ?? []),
            ],
          }
        : undefined,
    [combinedHistoricalData, latestQuery.data]
  );

  return useMemo(
    () => ({
      data,
      error: latestQuery.error ?? historicalError,
      fetchNextPage,
      hasNextPage: historicalData
        ? hasNextPage
        : Boolean(latestQuery.data?.nextPage),
      isFetching: latestQuery.isFetching || isFetchingHistorical,
      isFetchingNextPage,
      isLoading: latestQuery.isLoading,
    }),
    [
      data,
      fetchNextPage,
      hasNextPage,
      historicalData,
      historicalError,
      isFetchingHistorical,
      isFetchingNextPage,
      latestQuery.data?.nextPage,
      latestQuery.error,
      latestQuery.isFetching,
      latestQuery.isLoading,
    ]
  );
}
