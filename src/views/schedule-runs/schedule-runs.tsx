'use client';

import ErrorPanel from '@/components/error-panel/error-panel';
import PageSection from '@/components/page-section/page-section';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { toggleSortOrder } from '@/utils/sort-by';
import schedulePageQueryParamsConfig from '@/views/schedule-page/config/schedule-page-query-params.config';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';

import getScheduleRunsQuery from './helpers/get-schedule-runs-query';
import ScheduleRunsTable from './schedule-runs-table/schedule-runs-table';
import { type Props } from './schedule-runs.types';

export default function ScheduleRuns({ params }: Props) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    schedulePageQueryParamsConfig,
    { pageRerender: false }
  );
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
    query: getScheduleRunsQuery(
      params.scheduleId,
      queryParams.scheduleRunsSortOrder
    ),
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
    </PageSection>
  );
}
