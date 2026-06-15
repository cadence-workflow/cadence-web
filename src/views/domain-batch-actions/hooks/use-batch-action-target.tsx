'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import getDayjsFromDateFilterValue from '@/components/date-filter/helpers/get-dayjs-from-date-filter-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import dayjs from '@/utils/datetime/dayjs';
import getVisibilityQuery from '@/utils/visibility/get-visibility-query';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import DOMAIN_WORKFLOWS_PAGE_SIZE from '@/views/domain-workflows/config/domain-workflows-page-size.config';
import useCountWorkflows from '@/views/shared/hooks/use-count-workflows';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';
import { type SelectionParams } from '@/views/shared/workflows-list/workflows-list.types';

import {
  BATCH_ACTION_DEFAULT_QUERY,
  BATCH_ACTION_SELECT_ALL_ROW_TOOLTIP,
} from '../domain-batch-actions.constants';
import buildSelectionQuery from '../helpers/build-selection-query';
import getWorkflowSelectionId from '../helpers/get-workflow-selection-id';

import useBatchActionSelection from './use-batch-action-selection';
import { styled } from './use-batch-action-target.styles';
import {
  type UseBatchActionTargetParams,
  type UseBatchActionTargetResult,
} from './use-batch-action-target.types';

/**
 * Single source of truth for a new batch action's target set. Encapsulates the
 * select-vs-query mode decision and everything derived from it — the displayed
 * list query, the count query, the manual selection, the query the action
 * ultimately runs against, and the query-mode hint to render — so the component
 * reads a flat set of values instead of branching on the mode in many places.
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
      search: queryParams.batchSearch,
      workflowStatuses: queryParams.batchStatuses,
      timeColumn: 'StartTime' as const,
      timeRangeStart: batchTimeRange.timeRangeStart,
      timeRangeEnd: batchTimeRange.timeRangeEnd,
    }),
    [queryParams.batchSearch, queryParams.batchStatuses, batchTimeRange]
  );

  // The displayed list, the count, and a "select all" submission all target the
  // same set. We omit ORDER BY: it is invalid for the count call, and the
  // backend's default list order is already StartTime DESC (with a RunID DESC
  // tie-breaker), so the displayed order is unchanged.
  const selectQuery = getVisibilityQuery({
    ...selectModeFilters,
    includeOrderBy: false,
  });

  const listQuery = isSelectMode ? selectQuery : queryParams.batchQuery;
  const countQuery = isSelectMode ? selectQuery : queryParams.batchQuery;

  // The query lives in URL params (not a form), so we validate it here: required,
  // with the error shown only after a submit attempt. Select mode is gated by the
  // selection count instead (see isTargetEmpty below).
  const isQueryEmpty = !queryParams.batchQuery?.trim();
  const showQueryError = !isSelectMode && submitAttempted && isQueryEmpty;
  const isDefaultQuery = queryParams.batchQuery === BATCH_ACTION_DEFAULT_QUERY;

  const {
    workflows,
    error,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useListWorkflows({
    domain,
    cluster,
    listType: 'default',
    pageSize: DOMAIN_WORKFLOWS_PAGE_SIZE,
    inputType: 'query',
    query: listQuery,
  });

  const {
    count: totalWorkflowCount,
    error: countError,
    isLoading: isCountLoading,
    refetch: refetchCount,
  } = useCountWorkflows({
    domain,
    cluster,
    query: countQuery,
  });

  const refetchAll = useCallback(() => {
    refetch();
    refetchCount();
  }, [refetch, refetchCount]);

  const selection = useBatchActionSelection({
    totalCount: totalWorkflowCount ?? 0,
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
      workflows.filter((workflow) =>
        selection.selectedIds.has(getWorkflowSelectionId(workflow))
      ),
    [workflows, selection.selectedIds]
  );

  let selectedCount = totalWorkflowCount ?? 0;
  if (isSelectMode && !selection.isAllSelected) {
    selectedCount = selectedWorkflows.length;
  }

  const isTargetEmpty = isSelectMode ? selectedCount === 0 : isQueryEmpty;

  const getBatchActionQuery = useCallback(() => {
    if (!isSelectMode) return queryParams.batchQuery;
    if (selection.isAllSelected) return selectQuery;
    return buildSelectionQuery(selectedWorkflows);
  }, [
    isSelectMode,
    queryParams.batchQuery,
    selection.isAllSelected,
    selectQuery,
    selectedWorkflows,
  ]);

  // In select mode the list renders checkboxes wired to the selection state; in
  // query mode the whole query defines the target set, so there is no selection.
  const listSelection: SelectionParams | undefined = isSelectMode
    ? {
        isAllSelected: selection.isAllSelected,
        onToggleAll: selection.toggleAll,
        isSelected: (workflow) =>
          selection.isSelected(getWorkflowSelectionId(workflow)),
        isRowToggleDisabled: selection.isAllSelected,
        rowToggleDisabledReason: BATCH_ACTION_SELECT_ALL_ROW_TOOLTIP,
        onToggle: (workflow) =>
          selection.toggleId(getWorkflowSelectionId(workflow)),
      }
    : undefined;

  // The hint shown under the workflows header. Only query mode has one: the
  // empty-query error after a submit attempt, or the default-query caption.
  let queryHint: React.ReactNode = null;
  if (!isSelectMode) {
    if (showQueryError) {
      queryHint = (
        <styled.QueryError>Query must not be empty</styled.QueryError>
      );
    } else if (isDefaultQuery) {
      queryHint = (
        <styled.QueryCaption>
          Showing all running workflows. Edit the query to narrow the set.
        </styled.QueryCaption>
      );
    }
  }

  return {
    workflows,
    error,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalWorkflowCount,
    countError,
    isCountLoading,
    refetchAll,
    selectedCount,
    isTargetEmpty,
    blocksSubmit: isSelectMode ? isTargetEmpty : showQueryError,
    getBatchActionQuery,
    onSubmitAttempt,
    queryHint,
    listSelection,
  };
}
