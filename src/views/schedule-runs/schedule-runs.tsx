'use client';

import ErrorPanel from '@/components/error-panel/error-panel';
import PageSection from '@/components/page-section/page-section';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useConfigValue from '@/hooks/use-config-value/use-config-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import schedulePageQueryParamsConfig from '@/views/schedule-page/config/schedule-page-query-params.config';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';

import getScheduleRunsQuery from './helpers/get-schedule-runs-query';
import ScheduleRunsHeader from './schedule-runs-header';
import ScheduleRunsTable from './schedule-runs-table/schedule-runs-table';
import { styled } from './schedule-runs.styles';
import { type Props } from './schedule-runs.types';

export default function ScheduleRuns({ params }: Props) {
  const [queryParams] = usePageQueryParams(schedulePageQueryParamsConfig);
  const { data: isPartialMatchingEnabled = false } = useConfigValue(
    'LIST_WORKFLOWS_PARTIAL_MATCH_ENABLED'
  );
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
    query: getScheduleRunsQuery(
      params.scheduleId,
      queryParams.scheduleRunsSearch,
      isPartialMatchingEnabled
    ),
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
        isFetchingNextPage={
          isFetchingNextPage || (isFetching && workflows.length > 0)
        }
      />
    );
  }

  return (
    <PageSection>
      <styled.Root>
        <ScheduleRunsHeader />
        {content}
      </styled.Root>
    </PageSection>
  );
}
