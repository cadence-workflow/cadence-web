'use client';

import React, { useMemo, useState } from 'react';

import { MdAdd } from 'react-icons/md';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import Table from '@/components/table/table';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import useListSchedules from '@/views/shared/hooks/use-list-schedules/use-list-schedules';

import schedulesTableConfig from './config/schedules-table.config';
import DomainSchedulesCreateModal from './domain-schedules-create-modal/domain-schedules-create-modal';
import DomainSchedulesHeader from './domain-schedules-header/domain-schedules-header';
import { SCHEDULES_PAGE_SIZE } from './domain-schedules.constants';
import { styled } from './domain-schedules.styles';
import { type Props } from './domain-schedules.types';
import filterSchedules from './helpers/filter-schedules';

export default function DomainSchedules({ domain, cluster }: Props) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useListSchedules({
    domain,
    cluster,
    pageSize: SCHEDULES_PAGE_SIZE,
  });

  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig, {
    pageRerender: false,
  });

  const schedules = useMemo(
    () => data?.pages.flatMap((page) => page.schedules ?? []) ?? [],
    [data]
  );

  const filteredSchedules = useMemo(
    () =>
      filterSchedules({
        schedules,
        search: queryParams.schedulesSearch,
        status: queryParams.schedulesStatus,
      }),
    [schedules, queryParams.schedulesSearch, queryParams.schedulesStatus]
  );

  const hasActiveFilters = Boolean(
    queryParams.schedulesSearch || queryParams.schedulesStatus
  );

  let content;
  if (isLoading) {
    content = <SectionLoadingIndicator />;
  } else if (error && schedules.length === 0) {
    content = (
      <PanelSection>
        <ErrorPanel
          message="Failed to load schedules"
          error={error}
          reset={refetch}
          actions={[{ kind: 'retry', label: 'Retry' }]}
        />
      </PanelSection>
    );
  } else if (schedules.length === 0) {
    content = (
      <PanelSection>
        <ErrorPanel
          message="No schedules found"
          description="No schedules have been defined for this domain. Click the button below to create a schedule and start automating your executions."
          omitLogging={true}
          actions={[
            {
              kind: 'callback',
              label: 'Create schedule',
              onClick: () => setIsCreateModalOpen(true),
              buttonKind: 'primary',
              shape: 'default',
              startEnhancer: <MdAdd size={16} aria-hidden />,
            },
          ]}
        />
      </PanelSection>
    );
  } else if (filteredSchedules.length === 0 && hasActiveFilters) {
    content = (
      <PanelSection>
        <ErrorPanel
          message="No schedules match your filters"
          description="Try changing the search term or clearing the filters."
          omitLogging={true}
        />
      </PanelSection>
    );
  } else {
    content = (
      <Table
        data={filteredSchedules}
        shouldShowResults
        endMessageProps={{
          kind: 'infinite-scroll',
          hasData: true,
          error,
          fetchNextPage,
          hasNextPage,
          isFetchingNextPage,
        }}
        columns={schedulesTableConfig}
      />
    );
  }

  return (
    <styled.Root>
      <DomainSchedulesHeader
        count={isLoading ? undefined : filteredSchedules.length}
        onCreateScheduleClick={() => setIsCreateModalOpen(true)}
      />
      {content}
      <DomainSchedulesCreateModal
        domain={domain}
        cluster={cluster}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </styled.Root>
  );
}
