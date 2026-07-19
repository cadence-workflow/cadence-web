'use client';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';

import getScheduleRunsQuery from './helpers/get-schedule-runs-query';
import ScheduleRunsTable from './schedule-runs-table';
import { type Props } from './schedule-runs.types';

export default function ScheduleRuns({ params }: Props) {
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
    query: getScheduleRunsQuery(params.scheduleId),
  });

  if (isLoading) {
    return <SectionLoadingIndicator />;
  }

  if (error) {
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

  if (workflows.length === 0) {
    return (
      <PanelSection>
        <ErrorPanel message="No schedule runs found" omitLogging />
      </PanelSection>
    );
  }

  return (
    <ScheduleRunsTable
      domain={params.domain}
      cluster={params.cluster}
      workflows={workflows}
      error={error}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}
