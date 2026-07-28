'use client';

import { useMemo } from 'react';

import getDayjsFromDateFilterValue from '@/components/date-filter/helpers/get-dayjs-from-date-filter-value';
import ErrorPanel from '@/components/error-panel/error-panel';
import PageFilters from '@/components/page-filters/page-filters';
import PageSection from '@/components/page-section/page-section';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useConfigValue from '@/hooks/use-config-value/use-config-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import dayjs from '@/utils/datetime/dayjs';
import { toggleSortOrder } from '@/utils/sort-by';
import schedulePageQueryParamsConfig from '@/views/schedule-page/config/schedule-page-query-params.config';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';
import WORKFLOWS_SEARCH_DEBOUNCE_MS from '@/views/shared/workflows-header/config/workflows-search-debounce-ms.config';

import scheduleRunsFiltersConfig from './config/schedule-runs-filters.config';
import getScheduleRunsQuery from './helpers/get-schedule-runs-query';
import ScheduleRunsTable from './schedule-runs-table/schedule-runs-table';
import { styled } from './schedule-runs.styles';
import { type Props } from './schedule-runs.types';

export default function ScheduleRuns({ params }: Props) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    schedulePageQueryParamsConfig,
    { pageRerender: false }
  );
  const { data: isPartialMatchingEnabled = false } = useConfigValue(
    'LIST_WORKFLOWS_PARTIAL_MATCH_ENABLED'
  );
  const timeRange = useMemo(() => {
    const now = dayjs();
    return {
      timeRangeStart: queryParams.scheduleRunsTimeStart
        ? getDayjsFromDateFilterValue(
            queryParams.scheduleRunsTimeStart,
            now
          ).toISOString()
        : undefined,
      timeRangeEnd: queryParams.scheduleRunsTimeEnd
        ? getDayjsFromDateFilterValue(
            queryParams.scheduleRunsTimeEnd,
            now
          ).toISOString()
        : undefined,
    };
  }, [queryParams.scheduleRunsTimeEnd, queryParams.scheduleRunsTimeStart]);
  const {
    workflows,
    error,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useListWorkflows({
    domain: params.domain,
    cluster: params.cluster,
    listType: 'default',
    pageSize: 20,
    inputType: 'query',
    query: getScheduleRunsQuery(params.scheduleId, {
      search: queryParams.scheduleRunsSearch,
      isPartialMatchingEnabled,
      ...timeRange,
      statuses: queryParams.scheduleRunsStatuses,
      runType: queryParams.scheduleRunsRunType,
      sortOrder: queryParams.scheduleRunsSortOrder,
    }),
  });

  let content;
  if (isLoading) {
    content = <SectionLoadingIndicator />;
  } else if (error && workflows.length === 0) {
    content = (
      <PanelSection>
        <ErrorPanel
          message="Failed to load schedule runs"
          error={error}
          reset={refetch}
          actions={[{ kind: 'retry', label: 'Retry' }]}
        />
      </PanelSection>
    );
  } else {
    content = (
      <ScheduleRunsTable
        domain={params.domain}
        cluster={params.cluster}
        workflows={workflows}
        error={error}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        sortOrder={queryParams.scheduleRunsSortOrder}
        onSort={(column) =>
          setQueryParams({
            scheduleRunsSortOrder: toggleSortOrder({
              currentSortColumn: 'CadenceScheduleTime',
              currentSortOrder: queryParams.scheduleRunsSortOrder,
              newSortColumn: column,
              defaultSortOrder: 'DESC',
            }),
          })
        }
      />
    );
  }

  return (
    <PageSection>
      <styled.Root>
        <PageFilters
          searchQueryParamKey="scheduleRunsSearch"
          searchPlaceholder="Search for runs by Run ID, Workflow ID or Backfill ID"
          pageFiltersConfig={scheduleRunsFiltersConfig}
          pageQueryParamsConfig={schedulePageQueryParamsConfig}
          inputDebounceDurationMs={WORKFLOWS_SEARCH_DEBOUNCE_MS}
        />
        {content}
      </styled.Root>
    </PageSection>
  );
}
