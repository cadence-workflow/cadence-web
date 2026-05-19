'use client';

import React, { useMemo } from 'react';

import { MdAdd } from 'react-icons/md';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import Table from '@/components/table/table';
import useListSchedules from '@/views/shared/hooks/use-list-schedules/use-list-schedules';

import schedulesTableConfig from './config/schedules-table.config';
import { SCHEDULES_PAGE_SIZE } from './domain-schedules.constants';
import { styled } from './domain-schedules.styles';
import { type Props } from './domain-schedules.types';

export default function DomainSchedules({ domain, cluster }: Props) {
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

  const schedules = useMemo(
    () => data?.pages.flatMap((page) => page.schedules ?? []) ?? [],
    [data]
  );

  const title = isLoading ? 'Schedules' : `Schedules (${schedules.length})`;

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
              onClick: () => {},
              buttonKind: 'primary',
              shape: 'default',
              startEnhancer: <MdAdd size={18} aria-hidden />,
            },
          ]}
        />
      </PanelSection>
    );
  } else {
    content = (
      <Table
        data={schedules}
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
      <styled.Toolbar>
        <styled.ToolbarTitle>{title}</styled.ToolbarTitle>
      </styled.Toolbar>
      {content}
    </styled.Root>
  );
}
