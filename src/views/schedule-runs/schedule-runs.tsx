'use client';
import { useMemo } from 'react';

import getDayjsFromDateFilterValue from '@/components/date-filter/helpers/get-dayjs-from-date-filter-value';
import ErrorPanel from '@/components/error-panel/error-panel';
import PageSection from '@/components/page-section/page-section';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import dayjs from '@/utils/datetime/dayjs';
import schedulePageQueryParamsConfig from '@/views/schedule-page/config/schedule-page-query-params.config';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';

import getScheduleRunsQuery from './helpers/get-schedule-runs-query';
import ScheduleRunsHeader from './schedule-runs-header';
import ScheduleRunsTable from './schedule-runs-table';
import { styled } from './schedule-runs.styles';
import { type Props } from './schedule-runs.types';

export default function ScheduleRuns({ params }: Props) {
  const [queryParams] = usePageQueryParams(schedulePageQueryParamsConfig);
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
    isFetching,
  } = useListWorkflows({
    domain: params.domain,
    cluster: params.cluster,
    listType: 'default',
    pageSize: 20,
    inputType: 'query',
    query: getScheduleRunsQuery(params.scheduleId, {
      ...timeRange,
      statuses: queryParams.scheduleRunsStatuses,
    }),
  });

  if (isLoading) {
    return <SectionLoadingIndicator />;
  }
  if (error && workflows.length === 0) {
    return (
      <PanelSection>
        <ErrorPanel
          message="Failed to load schedule runs"
          error={error}
          reset={refetch}
          actions={[{ kind: 'retry', label: 'Retry' }]}
        />
      </PanelSection>
    );
  }

  return (
    <PageSection>
      <styled.Root>
        <ScheduleRunsHeader />
        <ScheduleRunsTable
          domain={params.domain}
          cluster={params.cluster}
          workflows={workflows}
          error={error}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={
            isFetchingNextPage || (isFetching && workflows.length > 0)
          }
        />
      </styled.Root>
    </PageSection>
  );
}
