'use client';

import ErrorPanel from '@/components/error-panel/error-panel';
import PageSection from '@/components/page-section/page-section';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';

import getScheduleRunsQuery from './helpers/get-schedule-runs-query';
import { type Props } from './schedule-runs.types';

export default function ScheduleRuns({ params }: Props) {
  const { data, error, isLoading, refetch } = useListWorkflows({
    domain: params.domain,
    cluster: params.cluster,
    listType: 'default',
    pageSize: 20,
    inputType: 'query',
    query: getScheduleRunsQuery(params.scheduleId),
  });
  const workflows = data?.pages[0]?.workflows ?? [];

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

  return <PageSection>{JSON.stringify(workflows)}</PageSection>;
}
