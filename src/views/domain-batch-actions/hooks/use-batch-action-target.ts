'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import getDayjsFromDateFilterValue from '@/components/date-filter/helpers/get-dayjs-from-date-filter-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import dayjs from '@/utils/datetime/dayjs';
import escapeVisibilityQueryValue from '@/utils/visibility/escape-visibility-query-value';
import getVisibilityQuery from '@/utils/visibility/get-visibility-query';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import DOMAIN_WORKFLOWS_PAGE_SIZE from '@/views/domain-workflows/config/domain-workflows-page-size.config';
import useCountWorkflows from '@/views/shared/hooks/use-count-workflows';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';

import getQueryModeStrategy from '../helpers/get-query-mode-strategy';
import getSelectModeStrategy from '../helpers/get-select-mode-strategy';
import getWorkflowSelectionId from '../helpers/get-workflow-selection-id';

import useBatchActionSelection from './use-batch-action-selection';
import {
  type UseBatchActionTargetParams,
  type UseBatchActionTargetResult,
} from './use-batch-action-target.types';

/**
 * Single source of truth for a new batch action's target set.
 */
export default function useBatchActionTarget({
  domain,
  cluster,
}: UseBatchActionTargetParams): UseBatchActionTargetResult {
  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig);

  const isSelectMode = queryParams.batchInputType === 'search';

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const onSubmitAttempt = useCallback(() => setSubmitAttempted(true), []);

  // In "Select" mode the target set is defined by the search/filters plus the
  // checkbox selection; build the equivalent visibility query so the displayed
  // list, the count, and a "select all" submission all target the same set.
  const batchTimeRange = useMemo(() => {
    const now = dayjs();
    return {
      timeRangeStart: queryParams.batchTimeRangeStart
        ? getDayjsFromDateFilterValue(
            queryParams.batchTimeRangeStart,
            now
          ).toISOString()
        : undefined,
      timeRangeEnd: queryParams.batchTimeRangeEnd
        ? getDayjsFromDateFilterValue(
            queryParams.batchTimeRangeEnd,
            now
          ).toISOString()
        : undefined,
    };
  }, [queryParams.batchTimeRangeStart, queryParams.batchTimeRangeEnd]);

  const selectModeFilters = useMemo(
    () => ({
      // Escape the search term so quotes/backslashes cannot break out of the
      // quoted literal — this query also defines the target set when "select
      // all" submits the batch action.
      search: escapeVisibilityQueryValue(queryParams.batchSearch),
      workflowStatuses: queryParams.batchStatuses,
      timeColumn: 'StartTime' as const,
      timeRangeStart: batchTimeRange.timeRangeStart,
      timeRangeEnd: batchTimeRange.timeRangeEnd,
    }),
    [queryParams.batchSearch, queryParams.batchStatuses, batchTimeRange]
  );

  // We omit ORDER BY: it is invalid for the count call, and the backend's default
  // list order is already StartTime DESC (with a RunID DESC tie-breaker), so the
  // displayed order is unchanged.
  const selectQuery = getVisibilityQuery({
    ...selectModeFilters,
    includeOrderBy: false,
  });

  // The single mode decision: pick the strategy. Everything below is uniform.
  const strategy = isSelectMode
    ? getSelectModeStrategy({ selectQuery })
    : getQueryModeStrategy({
        batchQuery: queryParams.batchQuery,
        submitAttempted,
      });

  const workflowsQueryResult = useListWorkflows({
    domain,
    cluster,
    listType: 'default',
    pageSize: DOMAIN_WORKFLOWS_PAGE_SIZE,
    inputType: 'query',
    query: strategy.query,
  });

  const countQueryResult = useCountWorkflows({
    domain,
    cluster,
    query: strategy.query,
  });

  const { refetch: refetchList } = workflowsQueryResult;
  const { refetch: refetchCount } = countQueryResult;
  const refetchAll = useCallback(() => {
    refetchList();
    refetchCount();
  }, [refetchList, refetchCount]);

  const selection = useBatchActionSelection({
    totalCount: countQueryResult.count ?? 0,
  });
  const { reset: resetSelection } = selection;

  // Reset the selection whenever the matching set could change (search/filters
  // or the input mode), so checkmarks never refer to workflows no longer shown.
  useEffect(() => {
    resetSelection();
  }, [
    resetSelection,
    queryParams.batchInputType,
    queryParams.batchSearch,
    queryParams.batchStatuses,
    queryParams.batchTimeRangeStart,
    queryParams.batchTimeRangeEnd,
  ]);

  const selectedWorkflows = useMemo(
    () =>
      workflowsQueryResult.workflows.filter((workflow) =>
        selection.selectedIds.has(getWorkflowSelectionId(workflow))
      ),
    [workflowsQueryResult.workflows, selection.selectedIds]
  );

  const outputs = strategy.resolve({
    selection,
    selectedWorkflows,
    totalWorkflowCount: countQueryResult.count,
  });

  return {
    workflowsQueryResult,
    countQueryResult,
    refetchAll,
    onSubmitAttempt,
    ...outputs,
  };
}
